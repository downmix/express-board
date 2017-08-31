/*------------------------------------*/
/* [ 기반 구축 ] */
const express = require('express');
const morgan = require('morgan');
const basicAuth = require('express-basic-auth');
const randomstring = require("randomstring");
const bodyParser = require('body-parser');

const app = express();

const authMiddleware = basicAuth({
  users: { 'admin': '1q2w3e' },
  challenge: true,
  realm: 'Imb4T3st4pp'
});
const bodyParserMiddleware = bodyParser.urlencoded({ extended: false });

app.set('view engine', 'ejs');
app.use('/static', express.static('public'));
app.use(morgan('tiny'));

/*------------------------------------*/
/* [ data ] */
const boardData = [
  {
    id: 1, 
    title : '콜라... 콜라가 먹고싶네요.', 
    content: '얼음넣고 벌컥벌컥하고싶네요\r\n \r\nㅋㅋㅋㅋㅋㅋㅋㅋ\r\n금단증상 -0-;;', 
    date: 'Thu Aug 31 2017 15:09:40 GMT+0900 (KST)', 
    writer: '콜라곰'
  },
  {
    id: 2, 
    title : '열심히 로또를 합시다.', 
    content: '1등이 되는 그날까지.\r\n 한 30억 한방 먹고 흥청망청 쓰고싶네여', 
    date: 'Thu Aug 31 2017 15:09:40 GMT+0900 (KST)', 
    writer: '집돌이'
  }
];
const commentData = [
  {id: 1, boardId: 1, content: '덧글덧글', date: '', writer: 'Nee'},
  {id: 2, boardId: 1, content: '콜라는 코카콜라', date: '', writer: '프로악플러'},
  {id: 3, boardId: 2, content: '무플방지 위원회에서 왔습니다.', date: '', writer: 'ㄸ'},
  {id: 4, boardId: 1, content: '이님 콜라중독이네여', date: '', writer: '약쟁이'},
  {id: 5, boardId: 2, content: '로또되면 플스사서 겜질해야지', date: '', writer: '??'},
];

let boardSeq = boardData.length;
let commentSeq = commentData.length;

/*------------------------------------*/
/* [ 라우팅 ] */
app.get('/', (req, res) => {
  const boardList = boardData.sort(function(a, b){return b.id-a.id});
  const commentList = commentData.sort(function(a, b){return a.id-b.id});
  //console.log('[  boardList ] >>',  boardList );
  res.render('index.ejs', {boardList, commentList});
});

/*------------------------------------*/
/* [ 글 작성 페이지 ] */
app.get('/write', (req, res) => {
  res.render('write.ejs');
});

/*------------------------------------*/
/* [ 글 작성 POST ] */
app.post('/write', bodyParserMiddleware, (req, res) => {
  console.log(req.body, '<< [ req.body ]');

  if(req.body.writer || req.body.title){
    const data = {
      id: ++boardSeq,
      title : req.body.title, 
      writer: req.body.writer,
      content: req.body.content, 
      date: new Date()
    };

    boardData.push(data);
  }
  res.redirect('/');
});

/*------------------------------------*/
/* [ 글 삭제 ] */
app.post('/boardDelete', bodyParserMiddleware, authMiddleware, (req, res) => {

  const boardId = req.body.boardId;
  console.log(req.body, '<< [ req.body ]');
  

  const boardFind = boardData.indexOf(boardData.find(val => val.id.toString() === boardId));
  boardData.splice(boardFind,1);
  console.log(boardData, '<< [ boardData ]');
  
  res.redirect('/admin');
});

/*------------------------------------*/
/* [ 게시글 열람 ] */
app.get('/read/:id', (req, res) => {
  const boardItem = boardData.find(val => val.id == req.params.id);
  const commentListFind = commentData.filter(val => val.boardId == req.params.id);
  console.log(boardItem, '<< [ boardItem ]');
  boardItem ? res.render('read.ejs', {boardItem, commentListFind}) : res.redirect('/');
});

/*------------------------------------*/
/* [ 코멘트 작성 ] */
app.post('/comment', bodyParserMiddleware, (req, res) => {
  const content = req.body.content;
  
  if(req.body.writer || req.body.content){
    const data = {
      id: ++commentSeq, 
      boardId: req.body.boardId, 
      writer: req.body.writer,
      content: req.body.content, 
      date: new Date()
    };
    commentData.push(data);
  }
  
  res.redirect('/read/'+req.body.boardId);
});

/*------------------------------------*/
/* [ 관리자 페이지 ] */
app.get('/admin', authMiddleware, (req, res) => {
  const boardList = boardData.sort(function(a, b){return b.id-a.id});
  const commentList = commentData.sort(function(a, b){return a.id-b.id});
  res.render('admin.ejs', {boardList, commentList});
});

/*------------------------------------*/
/* [ Server ] */
app.listen(8000, () => {
  console.log('[ listening... ]');
});