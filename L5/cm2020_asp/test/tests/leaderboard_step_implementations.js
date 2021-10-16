/* globals gauge*/
"use strict";
const path = require('path');
const {
    openBrowser,
    write,
    closeBrowser,
    goto,
    press,
    screenshot,
    above,
    below,
    toRightOf,
    click,
    checkBox,
    listItem,
    toLeftOf,
    link,
    text,
    into,
    textBox,
    evaluate,
    emulateDevice,
    clear,
    button,
    waitFor,
    image,
    highlight,
    dropDown
} = require('taiko');
const assert = require("assert");

beforeSuite(async () => {
    await openBrowser(
        {headless: true}
    )
});

afterSuite(async () => {
    await closeBrowser();
});

step("Change device to iPhone X portrait", async () => {
    await emulateDevice('iPhone X')
});

step("Change device to iPhone X landscape", async () => {
    await emulateDevice('iPhone X landscape')
});

step("Open default app webpage", async () => {
    await goto("localhost:8080");
});

step("Click <text>", async (text) => {
    await highlight(text)
    await click(text)
});

step("Click button <text>", async (text) => {
    await highlight(button(text))
    await click(button(text))
});

step("Click link <text>", async (text) => {
    await highlight(link(text))
    await click(link(text))
});


step("Write <text>", async function(text) {
    await write(text);
});

step("Enter a grade of <grade>", async function(grade) {
    await clear(textBox({name:'grade'}))
    await write(grade,into(textBox({name:'grade'})))
});

step("Take a screenshot", async () => {
    await screenshot({path: `screenshot-${process.hrtime.bigint()}.png`});
});

step("Validate personal grade in <courseid> <module> in <session> with grade <grade>", async function(courseid, module, session, grade) {
    await assert.ok
        (await text(grade, {toRightOf: module, exactMatch: true}).exists(50000, 100)) &&
        (await text(module, {toRightOf: courseid, exactMatch: true}).exists(50000, 100)) &&
        (await text(courseid, {toRightOf: session, exactMatch: true}).exists(50000, 100))
    ;
});

step("Ensure personal grade in <courseid> <module> in <session> with grade <grade> does not exist", async function(courseid, module, session, grade) {
    await assert.ok
        (!await text(grade, {toRightOf: module, exactMatch: true}).exists(50000, 100)) &&
        (!await text(module, {toRightOf: courseid, exactMatch: true}).exists(50000, 100), true) &&
        (!await text(courseid, {toRightOf: session, exactMatch: true}).exists(50000, 100), true)
    ;
});

step("Click Slack sign in", async () => {
    await click(image({id:'slack-sign-in'}));
});

step("Enter workspace and continue", async () => {
    await write("londoncs");
    press(['Enter']);
});

step("Enter Slack email and password and continue", async () => {
    require("dotenv").config();
    await write(process.env.SLACK_EMAIL);
    await press(['Tab']);
    await write(process.env.SLACK_PASSWORD);
    await click('Sign in');
});

step("Validate user is logged in", async () => {
    await link("Logout").exists();
});

step("Verify that module <moduleId> is not available anymore", async(moduleId) => {
    await assert.ok(text(moduleId).exists);
})

step("<textFirst> is above <textSecond>", async (textFirst, textSecond) => {
    await assert.ok(text(textFirst), above(text(textSecond)));
});

step("Click edit for <moduleName>", async (moduleName) => {
    await click("edit", toRightOf(moduleName))
})


step("Select <dropDownName> <selection>", async (dropDownName, selection) => {
    await dropDown(below(dropDownName)).select(selection)
})

step("Check for user avatar on navbar", async () => {
    await image('user avatar').exists()
})

step("Check for user avatar in <module> leaderboard", async (module) => {
    await image('user avatar', {below: module, exactMatch: true}).exists(50000, 100)
})

step("Check for <checkText>", async (checkText) => {
    await assert.ok(await text(checkText).exists());
})