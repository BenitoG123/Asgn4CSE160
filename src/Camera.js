class Camera {
    constructor() {
        this.type = "Camera";
        this.fov = 60;
        this.y = 0;
        this.xAngle = 5;
        this.speed = 0.05;
        this.theta = Math.PI/2;
        //this.newx = 0;
        //this.newz = 0;

        this.eye = new Vector3([0,0,-3]);
        this.eye.elements[0] = 0.25;
        this.eye.elements[1] = -1;
        this.eye.elements[2] = -4.25;

        this.at = new Vector3([0,0,-1]);
        this.at.elements[0] = 0.25;
        this.at.elements[1] = -1;
        this.at.elements[2] = -1;

        this.up = new Vector3([0,1,0]);
        this.up.elements[0] = 0;
        this.up.elements[1] = 1;
        this.up.elements[2] = 0;

        this.view = new Matrix4();
        
        this.view.setLookAt(
            this.eye.elements[0],this.eye.elements[1],this.eye.elements[2], 
            this.at.elements[0],this.at.elements[1],this.at.elements[2], 
            this.up.elements[0],this.up.elements[1],this.up.elements[2]); // (eye, at, up);

        this.proj = new Matrix4();
        this.proj.setPerspective(this.fov, canvas.width/canvas.height, 0.1, 1000);
        
    }

    forward() {
        //debugger;

        //console.log("initial eye", this.eye);
        console.log(this.at);
        var at_copy = new Vector3(this.at.elements);
        //at_copy = this.at.sub(this.eye);
        //at_copy = this.at;
        //console.log("d = at", d);
        //console.log("at", this.at);
        at_copy.sub(this.eye);
        //console.log("d after sub", d);
        at_copy.normalize();
        at_copy.div(2);
        //console.log("at_copy after normal", at_copy);
        this.eye.add(at_copy);
        this.at.add(at_copy);
        console.log("final eye", this.eye);
    }

    back() {
        var at_copy = new Vector3(this.at.elements);
        //var 
        at_copy.sub(this.eye);
        at_copy.normalize();
        at_copy.div(2);
        this.eye.sub(at_copy);
        this.at.sub(at_copy);
    }

    left() {
        //debugger
        console.log("left");
        //var d = new Vector3();
        var at_copy = new Vector3(this.at.elements);
        //console.log(at_copy);
        
        at_copy.sub(this.eye);
        //console.log("d.elements left", d.elements);
        at_copy.normalize();
        //at_copy.div(2);
        //console.log("d.elements", d.elements);
        var s = new Vector3();

        s = Vector3.cross(this.up, at_copy);
        s.normalize();
        s.div(2);
        this.eye.add(s);
        this.at.add(s);
    }

    right() {
        var at_copy = new Vector3(this.at.elements);
        at_copy.sub(this.eye);
        //console.log("at_copy.elements right", at_copy.elements);
        at_copy.normalize();
        //console.log("d.elements", d.elements);

        var s = new Vector3();
        s = Vector3.cross(at_copy, this.up);
        s = s.normalize();
        s.div(2);
        this.eye = this.eye.add(s);
        this.at = this.at.add(s);
    }
  
    rotateLeft() {
        //debugger
        var at_copy = new Vector3(this.at.elements);
        var eye_copy = new Vector3(this.eye.elements);
        //var up_copy = new Vector3(this.up.elements);
        //var rotateMatrix = new Matrix4();
        /*

        at_copy.sub(this.eye);
        //console.log("at elements", this.at);

        


        rotateMatrix.setRotate(this.xAngle, up_copy.elements[0], up_copy.elements[1], up_copy.elements[2]);
        //console.log("rotateM", rotateMatrix.elements);
        rotateMatrix.multiplyVector3(at_copy);

        //console.log("rotateM", rotateMatrix.elements);
        
        var eye4 = new Vector4(this.eye.elements);
        eye4.elements[3] = 1;
        //console.log("eye4", eye4.elements);

        console.log(this.at.elements);
        console.log(rotateMatrix);

        rotateMatrix.elements[3] += eye4.elements[0];
        rotateMatrix.elements[7] += eye4.elements[1];
        rotateMatrix.elements[11] += eye4.elements[2];
        //console.log("rotateM", rotateMatrix.elements);
        //console.log(this.at.elements);
        //console.log(rotateMatrix[0, 3], rotateMatrix[1, 3], rotateMatrix[2, 3]);


        console.log(rotateMatrix.elements[3], rotateMatrix.elements[11]);
        //this.at.elements[0] = 0;
        this.at.elements[1] = 0;
        //this.at.elements[2] = -3;

        this.at.elements[0] += 0.9;
        //this.at.elements[1] = rotateMatrix.elements[0];
        this.at.elements[2] -= 0.08;
        console.log(this.at.elements);*/

        
        at_copy.sub(this.eye);
        at_copy.normalize();



        var r = Math.sqrt((at_copy.elements[0]*at_copy.elements[0]) + (at_copy.elements[2]*at_copy.elements[2]))

        var x = at_copy.elements[0];//*Math.PI/180;
        var z = at_copy.elements[2];//*Math.PI/180;

        console.log(this.theta);

        if (x > 0) { 
            this.theta = Math.atan(z / x); 
        }
        else if (x < 0 && z >= 0) { 
            this.theta = Math.atan(z / x) + Math.PI; 
        } 
        else if (x < 0 && z < 0) { 
            this.theta = Math.atan(z / x) - Math.PI;
        }
        
        //this.theta = Math.atan(z_rad/x_rad);
        //console.log(this.theta);

        this.theta -= (this.xAngle * Math.PI/180); //add 5 degrees in radians
        console.log(this.theta);
        /*if (this.theta < -Math.PI/2){
            console.log("bigger than pi/2");
            this.theta = -this.theta;//-(Math.PI)/2;

        }*/
        //console.log("theta", this.theta);

        var newx = r * Math.cos(this.theta);
        var newz = r * Math.sin(this.theta);
        console.log("newx", newx);
        console.log("newz", newz);
        at_copy.elements[0] = newx;
        at_copy.elements[2] = newz;

        eye_copy.add(at_copy);
        this.at.set(eye_copy);
        console.log(this.at.elements);

    }

    rotateRight() {
        //debugger
        var at_copy = new Vector3(this.at.elements);
        var eye_copy = new Vector3(this.eye.elements);

        at_copy.sub(this.eye);
        at_copy.normalize();

        var r = Math.sqrt((at_copy.elements[0]*at_copy.elements[0]) + (at_copy.elements[2]*at_copy.elements[2]))

        var x = at_copy.elements[0]; //*Math.PI/180
        var z = at_copy.elements[2]; //*Math.PI/180

        
        console.log(at_copy.elements);

        if (x > 0) { 
            this.theta = Math.atan(z / x); 
        }
        else if (x < 0 && z >= 0) { 
            this.theta = Math.atan(z / x) + Math.PI; 
        } 
        else if (x < 0 && z < 0) { 
            this.theta = Math.atan(z / x) - Math.PI;
        }

        //this.theta = Math.atan(at_copy.elements[2]/at_copy.elements[0]);
        
        console.log("after atan", this.theta);

        this.theta += (this.xAngle * Math.PI/180); //add 5 degrees in radians

        console.log(this.theta);
        /*if (this.theta > Math.PI/2){
            console.log("bigger than pi/2");
            this.theta = -this.theta;//3*(Math.PI)/2;

        }*/
        //console.log("theta", this.theta);

        var newx = r * Math.cos(this.theta);
        var newz = r * Math.sin(this.theta);
        //var newx = 0.07357639459
        //var newz = -0.04687340102
        console.log("newx", newx);
        console.log("newz", newz);
        at_copy.elements[0] = newx;
        at_copy.elements[2] = newz;

        eye_copy.add(at_copy);
        this.at.set(eye_copy);
        console.log(this.at.elements);

    }

    placeblock(){


        //edge of map top left 7.75x, 7.25z [31][31]
        //top right -7.75x, 7.25z [0][31]
        //bottom left 7.75x -8.25z [31][0]
        //bottom right -7.75x -8.25z [0][0]

        //map on screen
        //[31][31]    [0][31]
        //
        //         ^
        //         |
        //        you
        //
        //[31][0]     [0][0]

        //take (eye.x + 7.75)*2 = index for x
        //take (eye.z + 8.25)*2 = index for z

        var at_copy = new Vector3(this.at.elements);
        at_copy.sub(this.eye);
        //console.log("at_copy.elements right", at_copy.elements);
        at_copy.normalize();

        var degrees = this.theta*180/Math.PI

        var x = this.eye.elements[0];
        var z = this.eye.elements[2];

        var index_x = (x+7.75)*2;
        var index_z = (z+8.25)*2;
        console.log(index_x, index_z);

        index_x = Math.round(index_x);
        index_z = Math.round(index_z);

        console.log(index_x, index_z);

        if ((degrees >= 45) && (degrees <= 135)) { //fornt
            //increase z for forward
            index_z += 2;
        } else if ((degrees > 135) && (degrees < 225)) { //left
            index_x += 2;
        } else if ((degrees >= 225) && (degrees <= 315)) { //back
            index_z -= 2;
        } else if (((degrees > 315) && (degrees < 360)) | ((degrees > 0) && (degrees < 45))) { //right
            index_x -= 2;
        }
    
        console.log(index_x, index_z);

        //bind to 0-31
        if (index_x > 31) {
            index_x = 31;
        }
        if (index_x < 0) {
            index_x = 0;
        }
        if (index_z > 31) {
            index_z = 31;
        }
        if (index_z < 0) {
            index_z = 0;
        }

        g_map[index_x][index_z] += 1;
        
    }

    deleteblock(){

        var x = this.eye.elements[0];
        var z = this.eye.elements[2];

        var index_x = (x+7.75)*2;
        var index_z = (z+8.25)*2;

        //bind to 0-31
        if (index_x > 31) {
            index_x = 31;
        }
        if (index_x < 0) {
            index_x = 0;
        }
        if (index_z > 31) {
            index_z = 31;
        }
        if (index_z < 0) {
            index_z = 0;
        }

        if (g_map[index_x][index_z] > 0) {
            g_map[index_x][index_z] -= 1;
        }

    }
    
}