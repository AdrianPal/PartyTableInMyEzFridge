view.viewSize.height = document.body.clientHeight;
view.viewSize.width = document.body.clientWidth;

var socket = io.connect('http://10.212.97.185:3000');

var sessionId = socket.id;

paths = {};

socket.emit('connectionDraw');

function onMouseDown(event) {
    startPath( event.point, sessionId );
    socket.emit("startPath", {point: event.point}, sessionId);
}

function onMouseDrag(event) {

    var step        = event.delta ;
    step.angle      += 5; 
    var top         = event.middlePoint + step;
    var bottom      = event.middlePoint - step;

    continuePath( top, bottom, sessionId );

    socket.emit("continuePath", {top: top, bottom: bottom}, sessionId);
}

function onMouseUp(event) {
    endPath(event.point, sessionId);
    socket.emit("endPath", {point: event.point}, sessionId);
}
  
function onResize(event) {
    if(sessionId != undefined)
	    paths[sessionId].position = view.center;
}



function startPath( point, sessionId, fromSocket ) {
    paths[sessionId] = new Path();
    paths[sessionId].fillColor = 'lime';

    if(fromSocket) {
        if(point != undefined && point.length == 3){
            paths[sessionId].add(new Point(point[1], point[2]));
        }    
        return;
    }
    paths[sessionId].add(point);

}
  
function continuePath(top, bottom, sessionId, fromSocket) {

    var path = paths[sessionId];

    if(fromSocket) {
        if(top != undefined && bottom != undefined && top.length == 3 && bottom.length == 3){
            path.add(new Point(top[1],top[2]));
            path.insert(0, new Point(bottom[1],bottom[2]));
        }        
        return;
    }
    path.add(top);
    path.insert(0, bottom);

}
  
function endPath(point, sessionId, fromSocket) {

    var path = paths[sessionId];
    if(fromSocket) {
        if(point != undefined && point.length == 3){
            path.add(new Point(point[1], point[2]));
        }    
        return;
    }
    else {
        path.add(point);
    }
    path.closed = true;
    path.smooth();

    delete paths[sessionId]

}

socket.on('startPath', function( data, sessionId ) {
    startPath(data.point, sessionId, true);
    view.draw();
});

socket.on('continuePath', function (data, sessionId) {
    continuePath(data.top, data.bottom, sessionId, true);
    view.draw();  
});

socket.on('endPath', function( data, sessionId ) {
    endPath(data.point, sessionId, true);
    view.draw();
});

socket.on('connectedDraw', function(id) {
    sessionId = id;
})
  

  