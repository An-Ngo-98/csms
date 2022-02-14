const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const orders = {};

io.on("connection", socket => {
    let previousId;
    const safeJoin = currentId => {
        socket.leave(previousId);
        socket.join(currentId);
        previousId = currentId;
    };

    socket.on("getOrder", docId => {
        safeJoin(docId);
        socket.emit("document", orders[docId]);
        console.log('a');
    });

    socket.on("addOrder", doc => {
        orders[doc.id] = doc;
        socket.to(doc.id).emit("document", doc);
        console.log('b');
    });

    socket.on("updateOrder", doc => {
        orders[doc.id] = doc;
        socket.to(doc.id).emit("document", doc);
        console.log('c');
    });

    io.emit("orders", Object.keys(orders));
});

http.listen(80, () => {
    console.log('Listening on port 80');
});