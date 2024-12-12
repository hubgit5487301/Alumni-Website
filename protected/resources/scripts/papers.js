import {getdataonevent as getdata} from '../../protected-scripts/util.js';

const urlParams = new URLSearchParams(window.location.search);
const branch = urlParams.get('branch');
async function test() {

  const data = await getdata(`notes/${branch}`)
  console.log(data)
}

test()