import fs from "fs";
import * as yaml from "js-yaml";
import {Client, ClientChannel, SFTPWrapper} from "ssh2";

interface Config {
  host: string;
  port: number;
  username: string;
  privateKey: string;
}

const config = yaml.load(fs.readFileSync("config.yml", "utf-8")) as Config;

async function ReadDirectory(path: string): Promise<string[]> {
  return await new Promise((resolve) => {
    fs.readdir(path, (error: Error, items: string[]) => {
      if (error) {
        console.log(error);
        process.exit();
      }
      resolve(items);
    });
  });
}

function Connect(clientConfig: Config): Promise<Client> {
  return new Promise((resolve, reject) => {
    const client: Client = new Client();

    client.on("ready", () => {
      resolve(client);
    }).on("error", reject)
      .connect(clientConfig);
  });
}

async function UploadFile(sftp: SFTPWrapper, localPath: string, remotePath: string): Promise<void> {
  await new Promise((resolve) => {
    sftp.fastPut(localPath, remotePath, (error: Error) => {
      if (error) {
        console.log(error);
        process.exit();
      }
      resolve(null);
    });
  });
}

function ExecuteCommand(client: Client, command: string): Promise<boolean> {
  return new Promise((resolve) => {
    client.exec(command, {pty: true}, (error: Error, stream: ClientChannel) => {
      console.log(command);

      if (error) {
        console.log(error);
        resolve(false);
      }

      stream.on("close", (code: number) => {
        if (code === 0) resolve(true);
        else            resolve(false);
      }).on("data", (data: Buffer) => {
        console.log(data.toString());
      }).stderr.on("data", (data: Buffer) => {
        console.log(data.toString());
      });
    });
  });
}

function CreateSFTP(client: Client): Promise<SFTPWrapper> {
  return new Promise((resolve, reject) => {
    client.sftp((error: Error, sftp: SFTPWrapper) => {
      if (error) {
        console.log(error);
        reject(new Error("FAILURE"));
      }
      resolve(sftp);
    });
  });
}

async function Main(): Promise<void> {
  const clientConfig: Config = {
    host: config.host,
    port: config.port,
    username: config.username,
    privateKey: require("fs").readFileSync(config.privateKey) // eslint-disable-line
  };

  const client: Client      = await Connect(clientConfig);
  const sftp  : SFTPWrapper = await CreateSFTP(client);
  const files : string[]    = await ReadDirectory("backend/out");

  for (const file of files) {
    const localPath  = `backend/out/${file}`;
    const remotePath = `docker/fizz_club/backend/${file}`;
    await UploadFile(sftp, localPath, remotePath);
    console.log("FILE UPLOADED:", file);
  }

  const commands: string[] = [
    "cd docker",
    "docker build -t fizz_club docker/fizz_club --build-arg MODE=prod",
    "docker container stop $(docker container ls | grep fizz_club | grep -Eo '^[^ ]+')"
  ];

  for (const command of commands) {
    const result: boolean = await ExecuteCommand(client, command);

    if (result === false) {
      console.log("An error occurred, stopping");
      break;
    }
  }

  client.end();
}

Main();
