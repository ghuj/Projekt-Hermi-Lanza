# DevTips-Starter-Kit Gulp Version

HTML5 Boilerplate is a powerful front-end template for the development of fast, robust and flexible web applications or websites.

It is based on over ten years of continuous development and the accumulated knowledge of the community. As it does not prescribe a specific development philosophy or framework, you have the freedom to design your code according to your own ideas.

This is the third version of the DevTips Starter Kit. All packages, including Gulp and other dependencies, have been updated and brought up to date.


## Requeriments
This project have some requeriments you need to meet in order to compile it. First of all, you need NodeJS in order to run javascript on the console, you can go to the [NodeJS](http://nodejs.org) site and follow trough the installation process. After you get the `node` command on the console you will have the node package manager `npm` as well. Now you need to install Gulp  globally with the following command.




## Install
In order to start using the project you need to clone it to your pc. You can download the the zip version from [here](#) or clone the project with the git command.
```
git clone -b Gulp-Starter-Kit --single-branch https://github.com/ghuj/DevTips-Starter-Kit-V3.git project-name
git clone https://blablabla.github.com new-project
```
After you have it on you pc, you need to go in the console to the project folder and execute the following command to gather all the dependencies.

After the proccess finish you will have all you need to start coding.

## How to use
To start using it, the only thing you need to do is open the project on you code editor of choice and code. To compile and live preview all your changes you have some command that will help you. Here are the list of commands you should know.

Every command have to be executed on the root directory of the project using the gulp command like `gulp clean` or `gulp build`

* **start**: Compile and watch for changes (For development)
* **clean**: Removes all the compiled files on ./build
* **js**: Compile the JavaScript files
* **pug**: Compile the Pug templates
* **sass**: Compile the Sass styles
* **images**: Copy the newer to the build folder
* **favicon**: Copy the favicon to the build folder
* **vendors**: Copy the vendors to the build folder
* **build**: Build the project
* **watch**: Watch for any changes on the each section
* **help**: Print this message
* **browsersync**: Start the browsersync server

If you are in development, the `gulp start` command is the best choice for you. Go to the project folder in the console and execute `gulp start`, it will compile the project and start a server that will refresh every time you change something in the code. Gulp will be watching for changes and will tell you how to access the project from local and public url. Every browser that point to that url will be auto refreshed. As an extra feature for testing purpose any interaction on one browser will be reflected on any others. Try it on a phone, tablet and pc at the same time.

## Configuration
This project have some nice configuration options to meet all you needs. To configure you need to edit the `config.js` file and change any value you need. Every aspect of this configuration is described in the file so that you know the options.
