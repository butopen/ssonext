const execSync = require('child_process').execSync;
const readline = require('readline');

const c = process.argv[2];
let interactive = false;

function ask(query) {
  interactive = true;
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) =>
    rl.question(query, (ans) => {
      rl.close();
      resolve(ans);
    })
  );
}

(async () => {
  const requiredParams = [];
  console.log(process.argv);
  for (let p of c.split(' ')) {
    if (p.startsWith('$'))
      requiredParams.push({ name: p.substring(1), value: '' });
  }
  console.log('requiredParams: ', requiredParams);
  let index = 4;
  for (let p of requiredParams) {
    if (process.argv[index]) {
      p.value = process.argv[index];
    } else {
      const v = await ask(`Insert value for "${p.name}"? `);
      p.value = v;
    }
    index++;
  }
  console.log('requiredParams: ', requiredParams);

  let finalCommand = c;
  for (let p of requiredParams) {
    finalCommand = c.replace('$' + p.name, p.value);
  }

  if (interactive) {
    await ask(`Running "${finalCommand}" → confirm? press enter or CTRL+C`);
  }

  console.log('running ', finalCommand);
  execSync(finalCommand, { stdio: [0, 1, 2] });
})();
