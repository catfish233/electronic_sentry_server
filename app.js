const express = require('express');
const app = express();
const mongoose = require('mongoose');
const helmet = require('helmet'); // 使用Helmet避免被常见漏洞侵袭

// 添加CORS跨域处理
let cors = require('cors');
app.use(cors());

const port = 3050;
const dbUri = 'mongodb://localhost:27017/electronic_sentry';
// mongodb链接配置
const mongooseConfig = {
  useNewUrlParser: true,
  useUnifiedTopology: true
}

// 调用路由集合
const routes = require('./routes');
routes(app);
app.use(express.json()); // 添加解析JSON的中间件
app.use(helmet());
mongoose.set("strictQuery", false);
// 链接数据库
mongoose.connect(dbUri, mongooseConfig);
let db = mongoose.connection;

// 链接错误处理
db.on('error', function(error) {
  console.log(error);
});

// 定义Schema实例
const Schema = mongoose.Schema;
const NucleinSchema = new Schema({
  name: { 
    type: String,
    required: true,
    max: 100,
  },
  faceInfo: { type: String },
  nucleinInfo: {
    nucleinResult: { 
      type: String,
      enum: ['检测中', '无数据', '7日', '72小时', '48小时', '24小时',],
      default: '无数据'
    },
    healthCode: { 
      type: String,
      enum: ['green', 'red', 'yellow'],
      default: 'green'
    },
    vaccination: { 
      type: String,
      enum: ['未接种', '接种一针', '接种两针', '全程接种'],
      default: '未接种'
    },
  },
  verificationResult: { 
    type: Boolean,
    default: false
  },
});
// 链接集合
const NucleinModel = mongoose.model('Nuclein', NucleinSchema, 'nuclein');

// 查询集合
app.get('/', (req, res) => {
  NucleinModel.find({'faceInfo': req.query?.faceInfo}, (err, response) => {
    if(err) {
      res.send(err);
      return console.log(err);
    }
    console.log(response);
    res.send((response));
  })
});

// 暂时不用
// app.post('/', (req, res) => {
//   console.log("收到请求体：", req.body);
//   res.status(201).send(req.body);
// });

// app.put('/:id', (req, res) => {
//   console.log("收到请求参数， id为：", req.params?.id);
//   console.log("收到请求体：", req.body);
//   res.send("添加成功！");
// });

// app.delete('/:id', (req, res) => {
//   console.log("收到请求参数， id为：", req.params?.id);
//   res.status(204).send(req.params);
// });

// 监听端口
app.listen(port, () => {
  console.log(`Express server listening at http://localhost:${port}`);
});
