class Camera {
    constructor() {
        this.type = "Camera";
        this.fov = 60;
        this.y = 0;
        this.xAngle = 5;
        this.speed = 0.05;

        this.eye = new Vector3([0,0,-3]);
        this.eye.elements[0] = 0;
        this.eye.elements[1] = 0;
        this.eye.elements[2] = -3;

        this.at = new Vector3([0,0,-1]);
        this.at.elements[0] = 0;
        this.at.elements[1] = 0;
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
        //console.log("at_copy after normal", at_copy);
        this.eye.add(at_copy);
        this.at.add(at_copy);
        //console.log("final eye", this.eye);
    }

    back() {
        var at_copy = new Vector3(this.at.elements);
        //var 
        at_copy.sub(this.eye);
        at_copy.normalize();
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
        //console.log("d.elements", d.elements);
        var s = new Vector3();

        s = Vector3.cross(this.up, at_copy);
        s.normalize();
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
        this.eye = this.eye.add(s);
        this.at = this.at.add(s);
    }
  
    rotateLeft() {
        //debugger
        var at_copy = new Vector3(this.at.elements);
        var eye_copy = new Vector3(this.eye.elements);
        var up_copy = new Vector3(this.up.elements);
        var rotateMatrix = new Matrix4();
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

        var x_rad = at_copy.elements[0]*Math.PI/180;
        var z_rad = at_copy.elements[2]*Math.PI/180;
        
        var theta = Math.atan(z_rad,x_rad);
        console.log(theta);

        theta += (5 * Math.PI/180); //add 5 degrees in radians

        var newx = r * Math.cos(theta);
        var newz = r * Math.sin(theta);
        at_copy.elements[0] = newx;
        at_copy.elements[2] = newz;

        eye_copy.add(at_copy);
        this.at.set(eye_copy);
        console.log(this.at.elements);
        

    }

    rotateRight() {
        var at_copy = new Vector3(this.at.elements);
        var eye_copy = new Vector3(this.eye.elements);

        at_copy.sub(this.eye);
        at_copy.normalize();

        var r = Math.sqrt(at_copy.elements[0]*at_copy.elements[0] + at_copy.elements[1]*at_copy.elements[1])

        var x_rad = at_copy.elements[0]*Math.PI/180;
        var y_rad = at_copy.elements[1]*Math.PI/180;
        
        var theta = Math.atan(y_rad,x_rad);

        theta -= (5 * Math.PI/180); //add 5 degrees in radians

        var newx = r * Math.cos(theta);
        var newy = r * Math.sin(theta);
        at_copy.elements[0] = newx;
        at_copy.elements[1] = newy;

        eye_copy.add(at_copy);
        this.at.set(eye_copy);

    }
    
}