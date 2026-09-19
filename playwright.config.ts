import { defineConfig, devices } from '@playwright/test';
export default defineConfig({
 testDir:'./tests',timeout:30000,workers:2,reporter:[['list'],['html',{open:'never'}]],
 use:{baseURL:'http://127.0.0.1:4321',headless:true,launchOptions:{executablePath:process.env.CI?undefined:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',args:['--enable-unsafe-swiftshader']},trace:'retain-on-failure'},
 projects:[{name:'desktop',use:{viewport:{width:1440,height:1000}}},{name:'mobile',use:{...devices['iPhone 13'],defaultBrowserType:'chromium'}}],
});
