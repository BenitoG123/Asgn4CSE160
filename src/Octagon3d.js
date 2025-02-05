class Octagon3d{

    //constructor
    constructor(color){
      this.type='octagon3d';
      //this.position = [0.0, 0.0, 0.0];
      this.color = color;
      //this.size = 5.0;
      //this.segments = segments;
      //this.alpha = 0.4;
      this.matrix = new Matrix4();
      this.buffer = null;
      this.vertices = null;
    }
  

    //render this shape
    render() {
      //var xy = this.position;
      var rgba = this.color;
      //var size = this.size;
      //var alpha = this.alpha;
  
      gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
  


      //#-----
      // Pass the color of a point to u_FragColor variable
      gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
      //gl.uniform4f(u_FragColor, rgba[0]*0.5, rgba[1]*0.5, rgba[2]*0.5, rgba[3]);
      //gl.uniform4f(u_FragColor, 0.4,0.4,0.4, rgba[3]);

      //front of cude
      var front1 = new Triangle([0.0,0.0,0.0, 0.4,0.4,0.0, 0.4,0.0,0.0 ]);
      front1.drawTriangle3D();
      var front2 = new Triangle([0.0,0.0,0.0, 0.4,0.4,0.0, 0.0,0.4,0.0 ]);
      front2.drawTriangle3D();

      //#-----
      //pass the color of a point to u_FragColor uniform variable
      gl.uniform4f(u_FragColor, rgba[0]*.8, rgba[1]*.8, rgba[2]*.8, rgba[3]);
      //gl.uniform4f(u_FragColor, rgba[0]*0.5, rgba[1]*0.5, rgba[2]*0.5, rgba[3]);
      //gl.uniform4f(u_FragColor, 0.4,0.4,0.4, rgba[3]);

      //left
      var left1 = new Triangle([0.0,0.0,0.0, 0.0,0.4,-0.4, 0.0,0.0,-0.4 ]);
      left1.drawTriangle3D();
      var left2 = new Triangle([0.0,0.0,0.0, 0.0,0.4,-0.4, 0.0,0.4,0.0 ]);
      left2.drawTriangle3D();
      
      //#-----
      //pass the color of a point to u_FragColor uniform variable
      //gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
      //gl.uniform4f(u_FragColor, rgba[0]*0.8, rgba[1]*0.8, rgba[2]*0.8, rgba[3]);

      //right
      var right1 = new Triangle([0.4,0.0,0.0, 0.4,0.4,-0.4, 0.4,0.0,-0.4 ]);
      right1.drawTriangle3D();
      var right2 = new Triangle([0.4,0.0,0.0, 0.4,0.4,-0.4, 0.4,0.4,0.0 ]);
      right2.drawTriangle3D();
      //drawTriangle3D( [0.4,0.0,0.0, 0.4,0.4,-0.4, 0.4,0.0,-0.4 ]);
      //drawTriangle3D( [0.4,0.0,0.0, 0.4,0.4,-0.4, 0.4,0.4,0.0 ]);

      //#-----
      //pass the color of a point to u_FragColor uniform variable
      //gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
      gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

      //back
      var back1 = new Triangle([0.0,0.0,-0.4, 0.4,0.4,-0.4, 0.4,0.0,-0.4 ]);
      back1.drawTriangle3D();
      var back2 = new Triangle([0.0,0.0,-0.4, 0.4,0.4,-0.4, 0.0,0.4,-0.4 ]);
      back2.drawTriangle3D();
      //drawTriangle3D( [0.0,0.0,-0.4, 0.4,0.4,-0.4, 0.4,0.0,-0.4 ]);
      //drawTriangle3D( [0.0,0.0,-0.4, 0.4,0.4,-0.4, 0.0,0.4,-0.4 ]);

      //#-----
      //pass the color of a point to u_FragColor uniform variable
      //gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
      gl.uniform4f(u_FragColor, rgba[0]*0.9, rgba[1]*0.9, rgba[2]*0.9, rgba[3]);

      //top
      var top1 = new Triangle([0.0,0.4,0.0, 0.4,0.4,-0.4, 0.0,0.4,-0.4 ]);
      top1.drawTriangle3D();
      var top2 = new Triangle([0.0,0.4,0.0, 0.4,0.4,-0.4, 0.4,0.4,0.0 ]);
      top2.drawTriangle3D();
      //drawTriangle3D( [0.0,0.4,0.0, 0.4,0.4,-0.4, 0.0,0.4,-0.4 ]);
      //drawTriangle3D( [0.0,0.4,0.0, 0.4,0.4,-0.4, 0.4,0.4,0.0 ]);

      //#-----
      //pass the color of a point to u_FragColor uniform variable
      //gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
      gl.uniform4f(u_FragColor, rgba[0]*0.3, rgba[1]*0.3, rgba[2]*0.3, rgba[3]);
      
      //bottom
      var bottom1 = new Triangle([0.0,0.0,0.0, 0.4,0.0,-0.4, 0.4,0.0,0.0 ]);
      bottom1.drawTriangle3D();
      var bottom2 = new Triangle([0.0,0.0,0.0, 0.4,0.0,-0.4, 0.0,0.0,-0.4 ]);
      bottom2.drawTriangle3D();
      //drawTriangle3D( [0.0,0.0,0.0, 0.4,0.0,-0.4, 0.4,0.0,0.0 ]);
      //drawTriangle3D( [0.0,0.0,0.0, 0.4,0.0,-0.4, 0.0,0.0,-0.4 ]);

    }
}
