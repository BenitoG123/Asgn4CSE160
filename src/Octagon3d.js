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


      //sides

      gl.uniform4f(u_FragColor, rgba[0]*0.8, rgba[1]*0.8, rgba[2]*0.8, rgba[3]);
      //gl.uniform4f(u_FragColor, 0.4,0.4,0.4, rgba[3]);

      //front of cude
      var sfront1 = new Triangle([0.0,0.0,0.0, 0.4,height,0.0, 0.4,0.0,0.0 ]);
      sfront1.drawTriangle3D();
      var sfront2 = new Triangle([0.0,0.0,0.0, 0.4,height,0.0, 0.0,height,0.0 ]);
      sfront2.drawTriangle3D();

      gl.uniform4f(u_FragColor, rgba[0]*.7, rgba[1]*.7, rgba[2]*.7, rgba[3]);
      
      //front right
      var sfr1 = new Triangle([0.4,0.0,0.0, 0.68,height,0.28, 0.68,0.0,0.28 ]);
      sfr1.drawTriangle3D();
      var sfr2 = new Triangle([0.4,0.0,0.0, 0.68,height,0.28, 0.4,height,0.0 ]);
      sfr2.drawTriangle3D();

      gl.uniform4f(u_FragColor, rgba[0]*.6, rgba[1]*.6, rgba[2]*.6, rgba[3]);

      //right
      var sright = new Triangle([0.68,0.0,0.28, 0.68,height,0.68, 0.68,0.0,0.68 ]);
      sright.drawTriangle3D();
      var sright2 = new Triangle([0.68,0.0,0.28, 0.68,height,0.68, 0.68,height,0.28 ]);
      sright2.drawTriangle3D();

      gl.uniform4f(u_FragColor, rgba[0]*.5, rgba[1]*.5, rgba[2]*.5, rgba[3]);

      //back right
      var sbr1 = new Triangle([0.68,0.0,0.68, 0.4,height,0.96, 0.4,0.0,0.96 ]);
      sbr1.drawTriangle3D();
      var sbr2 = new Triangle([0.68,0.0,0.68, 0.4,height,0.96, 0.68,height,0.68 ]);
      sbr2.drawTriangle3D();

      gl.uniform4f(u_FragColor, rgba[0]*.4, rgba[1]*.4, rgba[2]*.4, rgba[3]);

      //back
      var sback1 = new Triangle([0.4,0.0,0.96, 0.0,height,0.96, 0.0,0.0,0.96 ]);
      sback1.drawTriangle3D();
      var sback2 = new Triangle([0.4,0.0,0.96, 0.0,height,0.96, 0.4,height,0.96 ]);
      sback2.drawTriangle3D();

      gl.uniform4f(u_FragColor, rgba[0]*.5, rgba[1]*.5, rgba[2]*.5, rgba[3]);

      //back left
      var sbl1 = new Triangle([0.0,0.0,0.96, -0.28,height,0.68, -0.28,0.0,0.68 ]);
      sbl1.drawTriangle3D();
      var sbl2 = new Triangle([0.0,0.0,0.96, -0.28,height,0.68, 0.0,height,0.96 ]);
      sbl2.drawTriangle3D();

      gl.uniform4f(u_FragColor, rgba[0]*.6, rgba[1]*.6, rgba[2]*.6, rgba[3]);

      //left
      var sleft1 = new Triangle([-0.28,0.0,0.68, -0.28,height,0.28, -0.28,0.0,0.28 ]);
      sleft1.drawTriangle3D();
      var sleft2 = new Triangle([-0.28,0.0,0.68, -0.28,height,0.28, -0.28,height,0.68 ]);
      sleft2.drawTriangle3D();

      gl.uniform4f(u_FragColor, rgba[0]*.7, rgba[1]*.7, rgba[2]*.7, rgba[3]);

      //front left
      var sfl1 = new Triangle([-0.28,0.0,0.28, -0.0,height,0.0, -0.0,0.0,0.0 ]);
      sfl1.drawTriangle3D();
      var sfl2 = new Triangle([-0.28,0.0,0.28, -0.0,height,0.0, -0.28,height,0.28 ]);
      sfl2.drawTriangle3D();
    }
}
