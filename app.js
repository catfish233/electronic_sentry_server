const express = require('express');
const app = express();
const port = 3000;
const routes = require('./routes');

app.use(express.json()); // 添加解析JSON的中间件

routes(app);

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.post('/', (req, res) => {
  console.log("收到请求体：", req.body);
  res.status(201).send(req.body);
});

app.put('/:id', (req, res) => {
  console.log("收到请求参数， id为：", req.params?.id);
  console.log("收到请求体：", req.body);
  res.send("添加成功！");
});

app.delete('/:id', (req, res) => {
  console.log("收到请求参数， id为：", req.params?.id);
  res.status(204).send(req.params);
});


app.listen(port, () => {
  console.log(`Express server listening at http://localhost:${port}`);
});
