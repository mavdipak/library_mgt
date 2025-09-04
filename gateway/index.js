const { mapGrpcError } = require('./__mapper__');
const express = require('express');
const bodyParser = require('body-parser');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const PROTO_PATH = process.env.PROTO_PATH || '/app/proto/library.proto';
const GRPC_TARGET = process.env.GRPC_TARGET || 'server:50051';
const cors = require('cors');   // 👈 add this


const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});
const proto = grpc.loadPackageDefinition(packageDefinition).library;

const client = new proto.LibraryService(GRPC_TARGET, grpc.credentials.createInsecure());
global.grpcClient = client;


const app = express();
app.use(bodyParser.json());
app.use(cors());   // 👈 allow all origins by default

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.get('/ready', (req, res) => {
  if (!global.grpcClient) return res.status(500).json({ status: 'not ready', reason: 'grpcClient missing' });
  client.ListMembers({}, (err, response) => {
    if (err) return res.status(500).json({ status: 'not ready', reason: err.message });
    res.json({ status: 'ready' });
  });
});

app.get('/members', (req, res) => {
  client.ListMembers({}, (err, response) => {
    if (err) return res.status(500).json({ error: mapGrpcError(err) });
    res.json(response);
  });
});

app.get('/books', (req, res) => {
  client.ListBooks({}, (err, response) => {
    if (err) return res.status(500).json({ error: mapGrpcError(err) });
    res.json(response);
  });
});

app.post('/borrow', (req, res) => {
  const { member_id, book_id } = req.body;
  client.BorrowBook({ member_id, book_id }, (err, response) => {
    if (err) return res.status(500).json({ error: mapGrpcError(err) });
    res.json(response);
  });
});

app.get('/members/:id/loans', (req, res) => {
  const member_id = parseInt(req.params.id);
  client.ListLoans({ member_id }, (err, response) => {
    if (err) return res.status(500).json({ error: mapGrpcError(err) });
    res.json(response);
  });
});

app.post('/return', (req, res) => {
  const { loan_id } = req.body;
  client.ReturnBook({ loan_id }, (err, response) => {
    if (err) return res.status(500).json({ error: mapGrpcError(err) });
    res.json(response);
  });
});

app.get('/members/:id/fines', (req, res) => {
  const member_id = parseInt(req.params.id);
  client.ListFines({ member_id }, (err, response) => {
    if (err) return res.status(500).json({ error: mapGrpcError(err) });
    res.json(response);
  });
});

app.post('/members/:id/pay', (req, res) => {
  const member_id = parseInt(req.params.id);
  client.PayFine({ member_id }, (err, response) => {
    if (err) return res.status(500).json({ error: mapGrpcError(err) });
    res.json(response);
  });
});

app.get('/books/overdue', (req, res) => {
  client.ListOverdueBooks({}, (err, response) => {
    if (err) return res.status(500).json({ error: mapGrpcError(err) });
    res.json(response);
  });
});

app.post('/members', (req, res) => {
  const { name, email } = req.body;
  client.CreateMember({ name, email }, (err, response) => {
    if (err) return res.status(500).json({ error: mapGrpcError(err) });
    res.json(response);
  });
});


app.get('/', (req, res) => res.json({ msg: 'Library Gateway' }));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Gateway listening on ${PORT}`));
