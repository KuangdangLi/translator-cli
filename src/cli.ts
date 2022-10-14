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

// program.command('split')
//   .description('Split a string into substrings and display as an array')
//   .argument('<string>', 'string to split')
//   .option('--first', 'display just the first substring')
//   .option('-s, --separator <char>', 'separator character', ',')
//   .action((str, options) => {
//     const limit = options.first ? 1 : undefined;
//     console.log(str.split(options.separator, limit));
//   });

program.parse(process.argv);