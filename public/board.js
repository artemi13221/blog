const btnConfirm = document.querySelector('#btn-confirm');
const btnCancle = document.querySelector('#btn-cancle');

btnConfirm.addEventListener('click', () => {
  const title = document.querySelector('#text-title');
  const body = document.querySelector('#text-body');
  const time = Date.now();
  if (title.value === '') {
    alert('제목을 입력해주세요.');
  } else if (body.value === '') {
    alert('본문을 입력해주세요.');
  } else {
    axios.post('/board', {
      id: 1,
      title: title.value,
      body: body.value,
      createAt: time,
      modifiedAt: time,
    })
      .then((responses) => {
        console.log(responses);
        window.location.replace('/');
      })
      .catch((error) => console.error(error));
  }
});

btnCancle.addEventListener('click', () => {
  if (confirm('정말 취소하시겠습니까?')) { window.history.back(); }
});
