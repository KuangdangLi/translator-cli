#!/usr/bin/env .node
import * as commander from 'commander'
import {translate} from './main';
const pkg = require('../package.json')
const program = new commander.Command()
const {version} =pkg


program
  .name('(CN-EN)translation')
  .description('translation between English and Chinese')
  .version(version)
  .usage('<word>')
  .argument('<word>','words to be translated')
  .action((word:string)=>{
    translate(word);
  })



program.parse(process.argv);