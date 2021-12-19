import fs from "fs";
import * as yaml from "js-yaml";
import {Client, ClientChannel, SFTPWrapper} from "ssh2";

interface Config {
  host: string;
  port: number;
  username: string;
  privateKey: string;
}

let config: Config = yaml.safeLoad(fs.readFileSync("config.yml", "utf-8")) as Config;

async function ReadDirectory(path: string): Promise<string[]> {
  return await new Promise((done: Function) => {
    fs.readdir(path, (error: Error, items: string[]) => {
      if (error) {
        console.log(error);
        process.exit();
      }
      done(items);
    });
  });
}

function Connect(clientConfig: Config): Promise<Client> {
  return new Promise((done: Function, fail: Function) => {
    let client: Client = new Client();

    client.on("ready", () => {
      done(client);
    }).on("error", fail)
      .connect(clientConfig);
  });
}

async function UploadFile(sftp: SFTPWrapper, localPath: string, remotePath: string): Promise<void> {
  await new Promise((done: Function) => {
    sftp.fastPut(localPath, remotePath, (error: Error) => {
      if (error) {
        console.log(error);
        process.exit();
      }
      done();
    });
  });
}

function ExecuteCommand(client: Client, command: string): Promise<boolean> {
  return new Promise((done: Function) => {
    client.exec(command, {pty: true}, (error: Error, stream: ClientChannel) => {
      console.log(command);

      if (error) {
        console.log(error);
        done(false);
      }

      stream.on("close", (code: number) => {
        if (code === 0) done(true);
        else            done(false);
      }).on("data", (data: Buffer) => {
        console.log(data.toString());
      }).stderr.on("data", (data: Buffer) => {
        console.log(data.toString());
      });
    });
  });
}

function CreateSFTP(client: Client): Promise<SFTPWrapper> {
  return new Promise((done: Function, fail: Function) => {
    client.sftp((error: Error, sftp: SFTPWrapper) => {
      if (error) {
        console.log(error);
        fail("FAILURE");
      }
      done(sftp);
    });
  });
}

async function Main(): Promise<void> {
  let clientConfig: Config = {
    host: config.host,
    port: config.port,
    username: config.username,
    privateKey: require("fs").readFileSync(config.privateKey)
  };

  let client: Client      = await Connect(clientConfig);
  let sftp  : SFTPWrapper = await CreateSFTP(client);
  let files : string[]    = await ReadDirectory("backend/out");

  for (let file of files) {
    let localPath : string = `backend/out/${file}`;
    let remotePath: string = `docker/fizz_club/backend/${file}`;
    await UploadFile(sftp, localPath, remotePath);
    console.log("FILE UPLOADED:", file);
  }

  let commands: string[] = [
    "cd docker",
    "docker build -t fizz_club docker/fizz_club --build-arg MODE=prod",
    "docker container stop $(docker container ls | grep fizz_club | grep -Eo '^[^ ]+')"
  ];

  for (let command of commands) {
    let result: boolean = await ExecuteCommand(client, command);

    if (result === false) {
      console.log("An error occurred, stopping");
      break;
    }
  }

  client.end();
}

Main();
