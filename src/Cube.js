class Cube{

    //constructor
    constructor(color){
      this.type='cube';
      //this.position = [0.0, 0.0, 0.0];
      this.color = color;
      //this.size = 5.0;
      //this.segments = segments;
      //this.alpha = 1.0;
      this.matrix = new Matrix4();
      this.normalMatrix = new Matrix4();
      this.textureNum = -1;
      this.buffer = null;
      this.vertices = null;
      this.fixtop = false;
      this.shadeside = false;
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
  
      gl.uniformMatrix4fv(u_NormalMatrix, false, this.normalMatrix.elements);
  
      //#-----
      // Pass the color of a point to u_FragColor variable
      gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
      //gl.uniform4f(u_FragColor, 1.0,1.0,1.0, rgba[3]);

      //front of cude
      var front1 = new Triangle([0.0,0.0,0.0, 1.0,1.0,0.0, 1.0,0.0,0.0 ]);
      front1.uv = [0,0, 1,1, 1,0];
      front1.normal = [0,0,-1, 0,0,-1, 0,0,-1];
      front1.drawTriangle3DUVNormal();
      var front2 = new Triangle([0.0,0.0,0.0, 1.0,1.0,0.0, 0.0,1.0,0.0 ]);
      front2.uv = [0,0, 1,1, 0,1];
      front2.normal = [0,0,-1, 0,0,-1, 0,0,-1];
      front2.drawTriangle3DUVNormal();

      //#-----
      //pass the color of a point to u_FragColor uniform variable
      //gl.uniform4f(u_FragColor, rgba[0]*.8, rgba[1]*.8, rgba[2]*.8, rgba[3]);
      //gl.uniform4f(u_FragColor, rgba[0]*0.5, rgba[1]*0.5, rgba[2]*0.5, rgba[3]);
      //gl.uniform4f(u_FragColor, 1.0,1.0,1.0, rgba[3]);

      //left
      var left1 = new Triangle([0.0,0.0,0.0, 0.0,1.0,-1.0, 0.0,0.0,-1.0 ]);
      left1.uv = [0,0, 1,1, 1,0];
      left1.normal = [-1,0,0, -1,0,0, -1,0,0];
      left1.drawTriangle3DUVNormal();

      var left2 = new Triangle([0.0,0.0,0.0, 0.0,1.0,-1.0, 0.0,1.0,0.0 ]);
      left2.uv = [0,0, 1,1, 0,1];
      left2.normal = [-1,0,0, -1,0,0, -1,0,0];
      left2.drawTriangle3DUVNormal();
      
      //#-----
      //pass the color of a point to u_FragColor uniform variable
      //gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
      //gl.uniform4f(u_FragColor, rgba[0]*0.8, rgba[1]*0.8, rgba[2]*0.8, rgba[3]);

      //right
      var right1 = new Triangle([1.0,0.0,0.0, 1.0,1.0,-1.0, 1.0,0.0,-1.0 ]);
      right1.uv = [0,0, 1,1, 1,0];
      right1.normal = [1,0,0, 1,0,0, 1,0,0];
      right1.drawTriangle3DUVNormal();
      var right2 = new Triangle([1.0,0.0,0.0, 1.0,1.0,-1.0, 1.0,1.0,0.0 ]);
      right2.uv = [0,0, 1,1, 0,1];
      right2.normal = [1,0,0, 1,0,0, 1,0,0];
      right2.drawTriangle3DUVNormal();
      //drawTriangle3D( [1.0,0.0,0.0, 1.0,1.0,-1.0, 1.0,0.0,-1.0 ]);
      //drawTriangle3D( [1.0,0.0,0.0, 1.0,1.0,-1.0, 1.0,1.0,0.0 ]);

      //#-----
      //pass the color of a point to u_FragColor uniform variable
      //gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
      //gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

      //back
      var back1 = new Triangle([0.0,0.0,-1.0, 1.0,1.0,-1.0, 1.0,0.0,-1.0 ]);
      back1.uv = [0,0, 1,1, 1,0];
      back1.normal = [0,0,1, 0,0,1, 0,0,1];
      back1.drawTriangle3DUVNormal();
      var back2 = new Triangle([0.0,0.0,-1.0, 1.0,1.0,-1.0, 0.0,1.0,-1.0 ]);
      back2.uv = [0,0, 1,1, 0,1];
      back2.normal = [0,0,1, 0,0,1, 0,0,1];
      back2.drawTriangle3DUVNormal();
      //drawTriangle3D( [0.0,0.0,-1.0, 1.0,1.0,-1.0, 1.0,0.0,-1.0 ]);
      //drawTriangle3D( [0.0,0.0,-1.0, 1.0,1.0,-1.0, 0.0,1.0,-1.0 ]);

      //#-----
      //pass the color of a point to u_FragColor uniform variable
      // if (this.fixtop == true) {
      //   gl.uniform4f(u_FragColor, rgba[0]*0.3, rgba[1]*0.3, rgba[2]*0.3, rgba[3]);
      // } else {
      //   gl.uniform4f(u_FragColor, rgba[0]*0.9, rgba[1]*0.9, rgba[2]*0.9, rgba[3]);
      // }
      //gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
      

      //top
      var top1 = new Triangle([0.0,1.0,0.0, 1.0,1.0,-1.0, 0.0,1.0,-1.0 ]);
      top1.uv = [0,0, 1,1, 1,0];
      top1.normal = [0,1,0, 0,1,0, 0,1,0];
      top1.drawTriangle3DUVNormal();
      var top2 = new Triangle([0.0,1.0,0.0, 1.0,1.0,-1.0, 1.0,1.0,0.0 ]);
      top2.uv = [0,0, 1,1, 0,1];
      top2.normal = [0,1,0, 0,1,0, 0,1,0];
      top2.drawTriangle3DUVNormal();
      //drawTriangle3D( [0.0,1.0,0.0, 1.0,1.0,-1.0, 0.0,1.0,-1.0 ]);
      //drawTriangle3D( [0.0,1.0,0.0, 1.0,1.0,-1.0, 1.0,1.0,0.0 ]);

      //#-----
      //pass the color of a point to u_FragColor uniform variable
      //if (this.fixtop == true) {
      //  gl.uniform4f(u_FragColor, rgba[0]*0.9, rgba[1]*0.9, rgba[2]*0.9, rgba[3]);
      //}
      // else {
      //  gl.uniform4f(u_FragColor, rgba[0]*0.3, rgba[1]*0.3, rgba[2]*0.3, rgba[3]);
      //}
      //gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
      
      //bottom
      var bottom1 = new Triangle([0.0,0.0,0.0, 1.0,0.0,-1.0, 1.0,0.0,0.0 ]);
      bottom1.uv = [0,0, 1,1, 1,0];
      bottom1.normal = [0,-1,0, 0,-1,0, 0,-1,0];
      bottom1.drawTriangle3DUVNormal();
      var bottom2 = new Triangle([0.0,0.0,0.0, 1.0,0.0,-1.0, 0.0,0.0,-1.0 ]);
      bottom2.uv = [0,0, 1,1, 0,1];
      bottom2.normal = [0,-1,0, 0,-1,0, 0,-1,0];
      bottom2.drawTriangle3DUVNormal();
      //drawTriangle3D( [0.0,0.0,0.0, 1.0,0.0,-1.0, 1.0,0.0,0.0 ]);
      //drawTriangle3D( [0.0,0.0,0.0, 1.0,0.0,-1.0, 0.0,0.0,-1.0 ]);

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
     

      //front of cude
      vert = vert.concat([0.0,0.0,0.0, 1.0,1.0,0.0, 1.0,0.0,0.0 ]);
      uv = uv.concat([0,0, 1,1, 1,0]);
      
      vert = vert.concat([0.0,0.0,0.0, 1.0,1.0,0.0, 0.0,1.0,0.0 ]);
      uv = uv.concat([0,0, 1,1, 0,1]);
      

      //#-----
      //pass the color of a point to u_FragColor uniform variable
      
      //gl.uniform4f(u_FragColor, rgba[0]*0.5, rgba[1]*0.5, rgba[2]*0.5, rgba[3]);
      //gl.uniform4f(u_FragColor, 1.0,1.0,1.0, rgba[3]);

      //left
      vert = vert.concat([0.0,0.0,0.0, 0.0,1.0,-1.0, 0.0,0.0,-1.0 ]);
      uv = uv.concat([0,0, 1,1, 1,0]);
      //left1.drawTriangle3DUV();

      vert = vert.concat([0.0,0.0,0.0, 0.0,1.0,-1.0, 0.0,1.0,0.0 ]);
      uv = uv.concat([0,0, 1,1, 0,1]);
      //left2.drawTriangle3DUV();
      
      //#-----
      //pass the color of a point to u_FragColor uniform variable
      //gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
      //gl.uniform4f(u_FragColor, rgba[0]*0.8, rgba[1]*0.8, rgba[2]*0.8, rgba[3]);

      //right
      vert = vert.concat([1.0,0.0,0.0, 1.0,1.0,-1.0, 1.0,0.0,-1.0 ]);
      uv = uv.concat([0,0, 1,1, 1,0]);
      //right1.drawTriangle3DUV();
      vert = vert.concat([1.0,0.0,0.0, 1.0,1.0,-1.0, 1.0,1.0,0.0 ]);
      uv = uv.concat([0,0, 1,1, 0,1]);
      //right2.drawTriangle3DUV();
      //drawTriangle3D( [1.0,0.0,0.0, 1.0,1.0,-1.0, 1.0,0.0,-1.0 ]);
      //drawTriangle3D( [1.0,0.0,0.0, 1.0,1.0,-1.0, 1.0,1.0,0.0 ]);

      //#-----
      //pass the color of a point to u_FragColor uniform variable
      //gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
      //gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

      //back
      vert = vert.concat([0.0,0.0,-1.0, 1.0,1.0,-1.0, 1.0,0.0,-1.0 ]);
      uv = uv.concat([0,0, 1,1, 1,0]);
      //back1.drawTriangle3DUV();
      vert = vert.concat([0.0,0.0,-1.0, 1.0,1.0,-1.0, 0.0,1.0,-1.0 ]);
      uv = uv.concat([0,0, 1,1, 0,1]);
      //back2.drawTriangle3DUV();
      //drawTriangle3D( [0.0,0.0,-1.0, 1.0,1.0,-1.0, 1.0,0.0,-1.0 ]);
      //drawTriangle3D( [0.0,0.0,-1.0, 1.0,1.0,-1.0, 0.0,1.0,-1.0 ]);

      //#-----
      //pass the color of a point to u_FragColor uniform variable
      
      //gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
      

      //top
      vert = vert.concat([0.0,1.0,0.0, 1.0,1.0,-1.0, 0.0,1.0,-1.0 ]);
      uv = uv.concat([0,0, 1,1, 1,0]);
      //top1.drawTriangle3DUV();
      vert = vert.concat([0.0,1.0,0.0, 1.0,1.0,-1.0, 1.0,1.0,0.0 ]);
      uv = uv.concat([0,0, 1,1, 0,1]);
      //top2.drawTriangle3DUV();
      //drawTriangle3D( [0.0,1.0,0.0, 1.0,1.0,-1.0, 0.0,1.0,-1.0 ]);
      //drawTriangle3D( [0.0,1.0,0.0, 1.0,1.0,-1.0, 1.0,1.0,0.0 ]);

      //#-----
      //pass the color of a point to u_FragColor uniform variable
      
      //gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
      
      //bottom
      vert = vert.concat([0.0,0.0,0.0, 1.0,0.0,-1.0, 1.0,0.0,0.0 ]);
      uv = uv.concat([0,0, 1,1, 1,0]);
      //bottom1.drawTriangle3DUV();
      vert = vert.concat([0.0,0.0,0.0, 1.0,0.0,-1.0, 0.0,0.0,-1.0 ]);
      uv = uv.concat([0,0, 1,1, 0,1]);
      //bottom2.drawTriangle3DUV();
      //drawTriangle3D( [0.0,0.0,0.0, 1.0,0.0,-1.0, 1.0,0.0,0.0 ]);
      //drawTriangle3D( [0.0,0.0,0.0, 1.0,0.0,-1.0, 0.0,0.0,-1.0 ]);

      var alltri = new Triangle(vert);
      alltri.uv = uv;
      alltri.drawTriangle3DUV();

    }
}
