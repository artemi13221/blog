const modifyBtn = document.querySelector('.btn-modify');
const deleteBtn = document.querySelector('.btn-delete');

function getID() {
  const urlArray = document.URL.split('/');

  return urlArray[urlArray.length - 1];
}

modifyBtn.addEventListener('click', () => {
  window.location.href = `/board/newpost?id=${getID()}`;
});

deleteBtn.addEventListener('click', () => {
  if (confirm('정말 삭제하시겠습니까?')) {
    axios.delete('/board', {
      data: {
        id: getID(),
      },
    })
      .then((responses) => {
        if (responses.data === 'role error') {
          alert('당신은 권한이 없습니다.');
          return;
        }
        if (responses.data === 'error') {
          alert('에러가 발생하였습니다. 이미 삭제된 게시글입니다.');
        }
        window.location.replace('/');
      })
      .catch((error) => console.error(error));
  }
});
