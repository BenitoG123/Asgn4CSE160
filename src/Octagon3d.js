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
      var height = 0.4;
  
      gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
  


      //bottom octagon

      //#-----1
      // Pass the color of a point to u_FragColor variable
      //gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
      gl.uniform4f(u_FragColor, rgba[0]*0.3, rgba[1]*0.3, rgba[2]*0.3, rgba[3]);
      //gl.uniform4f(u_FragColor, 0.4,0.4,0.4, rgba[3]);

      //front of cude
      var front1 = new Triangle([0.0,0.0,0.0, 0.2,0.0,0.48, 0.4,0.0,0.0 ]);
      front1.drawTriangle3D();

      //#-----2
      //pass the color of a point to u_FragColor uniform variable
      //gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
      //gl.uniform4f(u_FragColor, rgba[0]*0.9, rgba[1]*0.9, rgba[2]*0.9, rgba[3]);

      //front right
      var fr = new Triangle([0.4,0.0,0.0, 0.2,0.0,0.48, 0.68,0.0,0.28 ]);
      fr.drawTriangle3D();

      //#-----3
      //pass the color of a point to u_FragColor uniform variable
      //gl.uniform4f(u_FragColor, rgba[0]*.8, rgba[1]*.8, rgba[2]*.8, rgba[3]);
      //gl.uniform4f(u_FragColor, rgba[0]*0.5, rgba[1]*0.5, rgba[2]*0.5, rgba[3]);
      //gl.uniform4f(u_FragColor, 0.4,0.4,0.4, rgba[3]);

      //right
      var right = new Triangle([0.68,0.0,0.28, 0.2,0.0,0.48, 0.68,0.0,0.68 ]);
      right.drawTriangle3D();

      //#-----4
      //pass the color of a point to u_FragColor uniform variable
      //gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
      //gl.uniform4f(u_FragColor, rgba[0]*0.9, rgba[1]*0.9, rgba[2]*0.9, rgba[3]);

      //back right
      var br = new Triangle([0.68,0.0,0.68, 0.2,0.0,0.48, 0.4,0.0,0.96 ]);
      br.drawTriangle3D();
      
      //#-----5
      //pass the color of a point to u_FragColor uniform variable
      //gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
      //gl.uniform4f(u_FragColor, rgba[0]*0.8, rgba[1]*0.8, rgba[2]*0.8, rgba[3]);

      //back
      var back = new Triangle([0.4,0.0,0.96, 0.2,0.0,0.48, 0.0,0.0,0.96 ]);
      back.drawTriangle3D();
      //drawTriangle3D( [0.4,0.0,0.0, 0.4,0.4,-0.4, 0.4,0.0,-0.4 ]);
      //drawTriangle3D( [0.4,0.0,0.0, 0.4,0.4,-0.4, 0.4,0.4,0.0 ]);

      //#-----6
      //pass the color of a point to u_FragColor uniform variable
      //gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
      //gl.uniform4f(u_FragColor, rgba[0]*0.9, rgba[1]*0.9, rgba[2]*0.9, rgba[3]);

      //back left
      var bl = new Triangle([0.0,0.0,0.96, 0.2,0.0,0.48, -0.28,0.0,0.68 ]);
      bl.drawTriangle3D();

      //#-----7
      //pass the color of a point to u_FragColor uniform variable
      //gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
      //gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

      //left
      var left = new Triangle([-0.28,0.0,0.68, 0.2,0.0,0.48, -0.28,0.0,0.28 ]);
      left.drawTriangle3D();
      //drawTriangle3D( [0.0,0.0,-0.4, 0.4,0.4,-0.4, 0.4,0.0,-0.4 ]);
      //drawTriangle3D( [0.0,0.0,-0.4, 0.4,0.4,-0.4, 0.0,0.4,-0.4 ]);

      //#-----8
      //pass the color of a point to u_FragColor uniform variable
      //gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
      //gl.uniform4f(u_FragColor, rgba[0]*0.9, rgba[1]*0.9, rgba[2]*0.9, rgba[3]);

      //front left
      var fl = new Triangle([-0.28,0.0,0.28, 0.2,0.0,0.48, 0.0,0.0,0.0 ]);
      fl.drawTriangle3D();


      //top octagon

            //#-----1
      // Pass the color of a point to u_FragColor variable
      //gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
      gl.uniform4f(u_FragColor, rgba[0]*0.9, rgba[1]*0.9, rgba[2]*0.9, rgba[3]);
      //gl.uniform4f(u_FragColor, 0.4,0.4,0.4, rgba[3]);

      //front of cude
      var front1 = new Triangle([0.0,height,0.0, 0.2,height,0.48, 0.4,height,0.0 ]);
      front1.drawTriangle3D();

      //#-----2
      //pass the color of a point to u_FragColor uniform variable
      //gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
      //gl.uniform4f(u_FragColor, rgba[0]*0.9, rgba[1]*0.9, rgba[2]*0.9, rgba[3]);

      //front right
      var fr = new Triangle([0.4,height,0.0, 0.2,height,0.48, 0.68,height,0.28 ]);
      fr.drawTriangle3D();

      //#-----3
      //pass the color of a point to u_FragColor uniform variable
      //gl.uniform4f(u_FragColor, rgba[0]*.8, rgba[1]*.8, rgba[2]*.8, rgba[3]);
      //gl.uniform4f(u_FragColor, rgba[0]*0.5, rgba[1]*0.5, rgba[2]*0.5, rgba[3]);
      //gl.uniform4f(u_FragColor, 0.4,0.4,0.4, rgba[3]);

      //right
      var right = new Triangle([0.68,height,0.28, 0.2,height,0.48, 0.68,height,0.68 ]);
      right.drawTriangle3D();

      //#-----4
      //pass the color of a point to u_FragColor uniform variable
      //gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
      //gl.uniform4f(u_FragColor, rgba[0]*0.9, rgba[1]*0.9, rgba[2]*0.9, rgba[3]);

      //back right
      var br = new Triangle([0.68,height,0.68, 0.2,height,0.48, 0.4,height,0.96 ]);
      br.drawTriangle3D();
      
      //#-----5
      //pass the color of a point to u_FragColor uniform variable
      //gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
      //gl.uniform4f(u_FragColor, rgba[0]*0.8, rgba[1]*0.8, rgba[2]*0.8, rgba[3]);

      //back
      var back = new Triangle([0.4,height,0.96, 0.2,height,0.48, 0.0,height,0.96 ]);
      back.drawTriangle3D();
      //drawTriangle3D( [0.4,0.0,0.0, 0.4,0.4,-0.4, 0.4,0.0,-0.4 ]);
      //drawTriangle3D( [0.4,0.0,0.0, 0.4,0.4,-0.4, 0.4,0.4,0.0 ]);

      //#-----6
      //pass the color of a point to u_FragColor uniform variable
      //gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
      //gl.uniform4f(u_FragColor, rgba[0]*0.9, rgba[1]*0.9, rgba[2]*0.9, rgba[3]);

      //back left
      var bl = new Triangle([0.0,height,0.96, 0.2,height,0.48, -0.28,height,0.68 ]);
      bl.drawTriangle3D();

      //#-----7
      //pass the color of a point to u_FragColor uniform variable
      //gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
      //gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

      //left
      var left = new Triangle([-0.28,height,0.68, 0.2,height,0.48, -0.28,height,0.28 ]);
      left.drawTriangle3D();
      //drawTriangle3D( [0.0,0.0,-0.4, 0.4,0.4,-0.4, 0.4,0.0,-0.4 ]);
      //drawTriangle3D( [0.0,0.0,-0.4, 0.4,0.4,-0.4, 0.0,0.4,-0.4 ]);

      //#-----8
      //pass the color of a point to u_FragColor uniform variable
      //gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
      //gl.uniform4f(u_FragColor, rgba[0]*0.9, rgba[1]*0.9, rgba[2]*0.9, rgba[3]);

      //front left
      var fl = new Triangle([-0.28,height,0.28, 0.2,height,0.48, 0.0,height,0.0 ]);
      fl.drawTriangle3D();
    }
}
