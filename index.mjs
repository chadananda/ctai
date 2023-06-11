import dotenv from 'dotenv';
import { program } from 'commander';
import { translateText, translateSideBySide } from './translator.mjs'; // Import translator functions
import { formatTxt, formatMd, formatDocx, formatPdf } from './formatter.mjs'; // Import formatting functions
import { art, helpMessage } from './help.mjs';
import fs from 'fs';

dotenv.config();

program
    .version('0.1.0') // You can set your application version here
    .name("cat") // You can set your application name here
    .command('set-key <key>')
    .description('Set the GPT API key')
    .action((key) => {
        console.log(art);
        // TODO: Store the key
        console.log(`API key set: ${key}`);
    });

program
    .command('translate <file> [style] [format] [outputLang]')
    .description('Translate a file')
    .action(async (file, style = 'literary', format = 'txt', outputLang = 'en') => {
        console.log(art);
        // Call translateText function from translator.mjs
        const translation = await translateText(file, style, outputLang);
        let outputData;
        switch(format) {
            case 'txt':
                outputData = formatTxt(translation);
                break;
            case 'md':
                outputData = formatMd(translation);
                break;
            case 'docx':
                outputData = await formatDocx(translation);
                break;
            case 'pdf':
                outputData = await formatPdf(translation);
                break;
            default:
                console.log(`Unsupported format: ${format}`);
                return;
        }
        fs.writeFileSync(`./output.${format}`, outputData);
        console.log(`Translation saved to ./output.${format}`);
    });

program
    .command('side-by-side <file> [style] [format] [outputLang]')
    .description('Translate a file and create a side-by-side translation')
    .action(async (file, style = 'literary', format = 'txt', outputLang = 'en') => {
        console.log(art);
        // Call translateSideBySide function from translator.mjs
        const translation = await translateSideBySide(file, style, outputLang);
        let outputData;
        switch(format) {
            case 'txt':
                outputData = formatTxt(translation);
                break;
            case 'md':
                outputData = formatMd(translation);
                break;
            case 'docx':
                outputData = await formatDocx(translation);
                break;
            case 'pdf':
                outputData = await formatPdf(translation);
                break;
            default:
                console.log(`Unsupported format: ${format}`);
                return;
        }
        fs.writeFileSync(`./output.${format}`, outputData);
        console.log(`Translation saved to ./output.${format}`);
    });

program
    .command('help')
    .description('Show help')
    .action(() => {
        console.log(art + helpMessage);
    });

program
    .action(() => {
        console.log(art + helpMessage);
    });

program.parse(process.argv);
