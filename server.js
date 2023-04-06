const express = require('express');
const app = express();
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

app.use(cors());
app.use(bodyParser.json());

// MySQLデータベースへの接続を設定する
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'todo_user',
  password: 'Yousei1996!',
  database: 'todo_list'
});

// TODOリストアイテムを取得するエンドポイント
app.get('/api/todos', (req, res) => {
  // TODOリストアイテムを取得するためのクエリを実行する
  const sql = 'SELECT * FROM todos';
  connection.query(sql, (err, results) => {
    if (err) {
      // エラーが発生した場合はエラーメッセージを送信する
      res.status(500).send({ error: 'Something failed!' });
      return;
    }

    // 結果を送信する
    res.send(results);
  });
});

// TODOリストアイテムを作成するエンドポイント
app.post('/api/todos', (req, res) => {
  const { task } = req.body;

  // TODOリストアイテムを作成するためのクエリを実行する
  const sql = 'INSERT INTO todos (task) VALUES (?)';
  connection.query(sql, [task], (err, result) => {
    if (err) {
      // エラーが発生した場合はエラーメッセージを送信する
      res.status(500).send({ error: 'Something failed!' });
      return;
    }

    // 作成したTODOリストアイテムのIDを含む結果を送信する
    res.send({ id: result.insertId });
  });
});

// TODOリストアイテムを更新するエンドポイント
app.put('/api/todos/:id', (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;

  // TODOリストアイテムを更新するためのクエリを実行する
  const sql = 'UPDATE todos SET completed = ? WHERE id = ?';
  connection.query(sql, [completed, id], (err, result) => {
    if (err) {
      // エラーが発生した場合はエラーメッセージを送信する
      res.status(500).send({ error: 'Something failed!' });
      return;
    }

    // 更新されたTODOリストアイテムを送信する
    res.send({ id, completed });
  });
});

// TODOリストアイテムを削除するエンドポイント
app.delete('/api/todos/:id', (req, res) => {
  const { id } = req.params;

  // TODOリストアイテムを削除するためのクエリを実行する
  const sql = 'DELETE FROM todos WHERE id = ?';
  connection.query(sql, [id], (err, result) => {
    if (err) {
      // エラーが発生した場合はエラーメッセージを送信する
res.status(500).send({ error: 'Something failed!' });
return;
}

// 削除されたTODOリストアイテムを送信する
res.send({ id });
});
});

// サーバーを起動する
app.listen(3001, () => {
console.log('Server listening on port 3001');
});