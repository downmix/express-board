const express = require('express');
const morgan = require('morgan');
const basicAuth = require('express-basic-auth');
const randomstring = require("randomstring");
const bodyParser = require('body-parser');

const app = express();

const boardData = [
  {
    id: 1, 
    title : '[Ex) Title]', 
    content: 'a sdlfjsdflk jlfk sdfjsldkfjldf', 
    date: '', 
    writer: 'downmix'
  },
  {
    id: 2, 
    title : 'Ex) 타이틀', 
    content: 'ㅇㄴ러ㅣ ㅓㅣㅏ ㅏㅣㄴㅇ라ㅓㅏㅣ 너ㅣ ㅏㅇㄴ러ㅣ ㄴㄹ어ㅣ ㅏㄹㅇ너ㅏㅣ ㅇㄹ나ㅣㅓㅇㄴㄹ ㅏ', 
    date: '', 
    writer: '광고글올리는사람'
  }
];
const commentData = [
  {id: 1, boardId: 1, content: '덧글덧글', date: '', writer: '프로악플러'},
  {id: 2, boardId: 1, content: '덧글덧글22\n22222', date: '', writer: '프로악플러eee'},
  {id: 3, boardId: 2, content: '무플방지 위원회에서 왔습니다.', date: '', writer: 'ㄸ'},
  
];

const authMiddleware = basicAuth({
  users: { 'admin': '1q2w3e' },
  challenge: true,
  realm: 'Imb4T3st4pp'
});
const bodyParserMiddleware = bodyParser.urlencoded({ extended: false });

app.set('view engine', 'ejs');
app.use('/static', express.static('public'));
app.use(morgan('tiny'));

app.get('/', (req, res) => {
  const boardList = boardData.sort(function(a, b){return b.id-a.id});
  const commentList = commentData.sort(function(a, b){return a.id-b.id});
  console.log('[  boardList ] >>',  boardList );
  res.render('index.ejs', {boardList, commentList});
});

app.listen(3000, () => {
  console.log('[ listening... ]');
});