class Camera {
    constructor() {
        this.type = "Camera";
        this.fov = 60;
        this.eye = new Vector3(0,0,-3);
        //this.eye[0] = 0;
        //this.eye[1] = 0;
        //this.eye[2] = -3;
        this.at = new Vector3(0,0,-3);
        //this.at[0] = 0;
        //this.at[1] = 0;
        //this.at[2] = -1;
        this.up = new Vector3(0,0,-3);
        //this.up[0] = 0;
        //this.up[1] = 1;
        //this.up[2] = 0;
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