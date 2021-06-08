#! /usr/bin/env node

const chalk = require("chalk");
const yargs = require("yargs");
const fs = require("fs");
const { cwd } = require("process");

const execute = require("../index.js");

const usage = "\nUsage: tlang <file> to be executed";
const options = yargs.usage(usage).help(true).argv;

let fPath = cwd() + "\\" + options["_"][0];

if (fPath != undefined) {
  let exists = fs.existsSync(fPath);
  if (exists == true) {
    console.log(chalk.green("Running program"));
    let program = fs.readFileSync(fPath, "utf8");
    execute(program)
  } else {
    console.log(chalk.red(`File "${fPath}" doesn't exists`));
  }
}
