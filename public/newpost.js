const btnConfirm = document.querySelector('#btn-confirm');
const btnCancel = document.querySelector('#btn-cancel');

function getPostID() {
  const params = window.location.search.substr(1).split('=');

  if (params[0] === 'id') {
    return params[1];
  }

  return undefined;
}

btnConfirm.addEventListener('click', () => {
  const title = document.querySelector('#text-title');
  const body = document.querySelector('#text-body');
  const time = Date.now();
  const idData = getPostID();

  if (title.value === '') {
    alert('제목을 입력해주세요.');
  } else if (body.value === '') {
    alert('본문을 입력해주세요.');
  } else if (idData === undefined) {
    axios.post('/board', {
      id: 1,
      title: title.value,
      body: body.value,
      createAt: time,
      modifiedAt: time,
    })
      .then((responses) => {
        console.log(responses);
        window.location.href = '/';
      })
      .catch((error) => console.error(error));
  } else {
    axios.put('/board', {
      id: idData,
      title: title.value,
      body: body.value,
      modifiedAt: time,
    })
      .then((responses) => {
        console.log(responses);
        window.location.href = '/';
      })
      .catch((error) => console.error(error));
  }
});

btnCancel.addEventListener('click', () => {
  if (confirm('정말 취소하시겠습니까?')) { window.history.back(); }
});
