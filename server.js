require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
mongoose.connect(
  'mongodb+srv://' +
    process.env.DBUSERNAME +
    ':' +
    process.env.DBPASSWORD +
    '@cluster0.siopf.mongodb.net/' +
    process.env.DBNAME +
    '?retryWrites=true&w=majority',
  { useNewUrlParser: true, useUnifiedTopology: true }
);

const port = process.env.PORT || 8080;

const taskSchema = new mongoose.Schema({
  des: String,
  taskTime: Date,
  category: String,
  done: Boolean,
});
const router = express.Router();
const task = mongoose.model('tasks', taskSchema);
app.get('/', (req, res) => res.send('in here!!!!'));

app.post('/insert', (req, res) => {
  const newTask = new task({
    des: req.body.des,
    taskTime: req.body.time,
    category: req.body.category,
    done: req.body.done,
  });
  newTask.save();
  res.send('INERTED!!!');
  console.log('inserted');
});

app.get('/tasks/:type', async (req, res) => {
  task.find({ category: req.params['type'] }, (err, doc) => {
    if (err) {
      console.log(err);
    } else {
      res.status(200).json(doc);
    }
  });
});

app.post('/changeDone', async (req, res) => {
  task.updateOne(
    { _id: req.body.id },
    { done: req.body.done },
    function (err, doc) {
      if (err) return res.send(500, { error: err });
      return res.send('Succesfully saved.');
    }
  );
});

app.get('/findall', async (req, res) => {
  task.find({}, (err, doc) => {
    if (err) {
      console.log(err);
    } else {
      res.status(200).json(doc);
    }
  });
});

app.get('/count', async (req, res) => {
  data = {};
  data.personal = await task.count({ category: 'personal' });
  data.home = await task.count({ category: 'home' });
  data.office = await task.count({ category: 'office' });
  res.send(data);
});

app.listen(port, () => console.log('listening !!!!'));
