class Sphere{

    //constructor
    constructor(){
      this.type='cube';
      //this.position = [0.0, 0.0, 0.0];
      this.color = [1,1,1,1];
      //this.size = 5.0;
      //this.segments = segments;
      //this.alpha = 1.0;
      this.matrix = new Matrix4();
      this.textureNum = -2;
      //this.buffer = null;
      this.verts = new Float32Array([]);
      //this.fixtop = false;
      //this.shadeside = false;
    }
  

    generateVertices() {
      //let v =[];
    }
    //render this shape
    render() {
      //var xy = this.position;
      var rgba = this.color;
      //var size = this.size;
      //var alpha = this.alpha;
      //rgba[3] = alpha;

      gl.uniform1i(u_whichTexture, this.textureNum);
  
      gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
  
      //#-----
      // Pass the color of a point to u_FragColor variable
      gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
      //gl.uniform4f(u_FragColor, 1.0,1.0,1.0, rgba[3]);

      var d=Math.PI/10;
      var dd=Math.PI/10;


      for (var t=0; t<Math.PI; t+=d) {
        for (var r=0; r <(2*Math.PI); r += d) {
            
            var p1 = [Math.sin(t)*Math.cos(r), Math.sin(t)*Math.sin(r), Math.cos(t)];
            var p2 = [Math.sin(t+dd)*Math.cos(r), Math.sin(t+dd)*Math.sin(r), Math.cos(t+dd)];
            var p3 = [Math.sin(t)*Math.cos(r+dd), Math.sin(t)*Math.sin(r+dd), Math.cos(t)];
            var p4 = [Math.sin(t+dd)*Math.cos(r+dd), Math.sin(t+dd)*Math.sin(r+dd), Math.cos(t+dd)];

            var uv1 = [t/Math.PI, r/(2*Math.PI)];
            var uv2 = [(t+dd)/Math.PI, r/(2*Math.PI)];
            var uv3 = [t/Math.PI, (r+dd)/(2*Math.PI)];
            var uv4 = [(t+dd)/Math.PI, (r+dd)/(2*Math.PI)];

            var v = [];
            var uv = [];
            v=v.concat(p1); uv=uv.concat(uv1);
            v=v.concat(p2); uv=uv.concat(uv2);
            v=v.concat(p4); uv=uv.concat(uv4);

            gl.uniform4f(u_FragColor, 1,1,1,1);
            var Tri1 = new Triangle(v);
            Tri1.uv = uv;
            Tri1.normal = v;
            Tri1.drawTriangle3DUVNormal();

            var v = [];
            var uv = [];
            v=v.concat(p1); uv=uv.concat(uv1);
            v=v.concat(p4); uv=uv.concat(uv4);
            v=v.concat(p3); uv=uv.concat(uv3);

            gl.uniform4f(u_FragColor, 1,1,1,1);
            var Tri2 = new Triangle(v);
            Tri2.uv = uv;
            Tri2.normal = v;
            Tri2.drawTriangle3DUVNormal();
        }
      }
      
    }


    renderfast() { //test 1
      var vert = [];
      var uv = [];
      var rgba = this.color;

      gl.uniform1i(u_whichTexture, this.textureNum);
  
      gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
  
      //#-----
      // Pass the color of a point to u_FragColor variable
      gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
      


    }
}
