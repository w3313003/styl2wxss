/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   index.js                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: Z·J <w3313003@163.com>                     +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2019/01/04 23:10:45 by Z·J               #+#    #+#             */
/*   Updated: 2019/01/05 03:30:53 by Z·J              ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */


const fs = require("fs");
const { exec } = require('child_process');
const readline = require('readline');
const { resolve } = require("path");
const args = process.argv.slice(2);
try {
    if(args.length) {
        const argStr = args.join("&").replace(/\s/g, '');
        const options = qs.parse(argStr);
        let { target, compress } = options;
        console.log(options);
        if(!target) {
            console.log('target not found, please check and restart');
            return;
        } 
        run(target, compress && JSON.parse(compress));
    } else {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        rl.question("请输入wxss文件需要储存的路径 \n", anwser => {
            run(anwser);
            rl.close();
        })
    }
} catch(e) {
    const { message, stack } = e;
    console.log({ message, stack });
};
function run(target, compress = false) {
    exec(`stylus -w ./dir/index.styl -o ./dir ${compress ? '-c' : ''}`);
    console.log(`初始化成功,wxss文件将储存至${resolve(target)},当前进程PID为${process.pid}`);
    return fs.watch('./dir/index.styl', {
        encoding: "utf-8"
    }, function() {
        const readSteam = fs.createReadStream('./dir/index.css');
        const writeSteam = fs.createWriteStream(target);
        readSteam.pipe(writeSteam);
    })
}
