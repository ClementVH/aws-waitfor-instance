const core = require('@actions/core');
const AWS = require('aws-sdk');

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const waitForInstance = () => {
  const client = new AWS.EC2({
    region: core.getInput('aws-region')
  });
  return new Promise((resolve, reject) => {
    client.waitFor('instance' + capitalizeFirstLetter(core.getInput('aws-instance-state')),
      {
        InstanceIds: [
          core.getInput('aws-instance-id')
        ]
      },
      (err, data) => {
        if (err) {
          reject(err);
        }
        resolve(data);
      }
    );
  });
};

async function run() {
  try {
    const res = await waitForInstance();
    console.log('Instance moved to state [' + core.getInput('aws-instance-state') +  '] successfully', JSON.stringify(res));
  } catch (error) {
    console.error(JSON.stringify(error));
    core.setFailed(error.message);
  }
}

run();
