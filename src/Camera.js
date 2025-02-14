class Camera {
    constructor() {
        this.type = "Camera";
        this.fov = 60;
        this.y = 0;
        this.xAngle = 0;
        this.speed = 0.05;

        this.eye = new Vector3(0,0,0);
        this.eye.x = 0;
        this.eye.y = 0;
        this.eye.z = 0;

        this.at = new Vector3(0,0,-1);
        this.at.x = 0;
        this.at.y = 0;
        this.at.z = -1;

        this.up = new Vector3(0,1,0);
        this.up.x = 0;
        this.up.y = 1;
        this.up.z = 0;

        this.view = new Matrix4();
        this.view.setLookAt(
            this.eye.x,this.eye.y,this.eye.z, 
            this.at.x,this.at.y,this.at.z, 
            this.up.x,this.up.y,this.up.z); // (eye, at, up);

        this.proj = new Matrix4();
        this.proj.setPerspective(this.fov, canvas.width/canvas.height, 0.1, 1000);
    }

    forward() {
        var d = new Vector3();
        d = this.at.sub(this.eye);
        d = d.normalize();
        this.eye = this.eye.add(d);
        this.at = this.at.add(d);
    }

    back() {
        var d = new Vector3();
        d = this.at.sub(this.eye);
        d = d.normalize();
        this.eye = this.eye.sub(d);
        this.at = this.at.sub(d);
    }

    left() {
        var d = new Vector3();
        d = this.at.sub(this.eye);
        d = d.normalize();

        var s = Vector3.cross(d, this.up);
        s = s.normalize();
        this.eye = this.eye.add(s);
        this.at = this.at.add(s);
    }

    right() {
        var d = new Vector3();
        d = this.at.sub(this.eye);
        d = d.normalize();

        var s = Vector3.cross(this.up, d);
        s = s.normalize();
        this.eye = this.eye.add(s);
        this.at = this.at.add(s);
    }
  
    rotateLeft() {
        var d = new Vector3();
        d = this.at.sub(this.eye);
        d = d.normalize();

        var r = Math.sqrt(d[0]**2 + d[1]**2)

        var theta = Math.arctan(d[1],d[0]);

        theta += (5 + Math.PI/180);

        var newx = r * Math.cos(theta);
        var newy = r * Math.sin(theta);
        d[0] = newx;
        d[1] = newy;

        this.at = this.eye.add(d);

    }

    rotateRight() {
        var d = new Vector3();
        d = this.at.sub(this.eye);
        d = d.normalize();

        var r = Math.sqrt(d[0]**2 + d[1]**2)

        var theta = Math.arctan(d[1],d[0]);

        theta -= (5 + Math.PI/180);

        var newx = r * Math.cos(theta);
        var newy = r * Math.sin(theta);
        d[0] = newx;
        d[1] = newy;

        this.at = this.eye.add(d);

    }
    
}