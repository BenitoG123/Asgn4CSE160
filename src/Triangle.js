class Triangle{

    //constructor
    constructor(vertices){
      this.type='triangle';
      this.position = [0.0, 0.0, 0.0];
      this.color = [1.0, 1.0, 1.0, 1.0];
      this.size = 5.0;
      this.alpha = 1.0;
      this.buffer = null;
      this.bufferUV = null;
      this.vertices = vertices;
      this.uv = [1,0, 0,1, 1,1]; //temp variable
    }
  
    //render this shape
    render() {
      var xy = this.position;
      var rgba = this.color;
      var size = this.size;
      //var alpha = this.alpha;

      //rgba[3] = alpha;
  
      // Pass the position of a point to a_Position variable
      //gl.vertexAttrib3f(a_Position, xy[0], xy[1], 0.0);
  
      // Pass the color of a point to u_FragColor variable
      gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
  
      //Pass the size of a point to u_Size variable
      gl.uniform1f(u_Size, size);
  
      // Draw
      var d = this.size/200.0; //delta
      drawTriangle( [xy[0], xy[1], xy[0]+d, xy[1], xy[0], xy[1]+d] );
    }

    drawTriangle(vertices) {
  
      var n = 3; // The number of vertices
    
      // Create a buffer object
      var vertexBuffer = gl.createBuffer();
      if (!vertexBuffer) {
        console.log('Failed to create the buffer object');
        return -1;
      }
    
      // Bind the buffer object to target
      gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
      // Write date into the buffer object
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);
      //gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    
      // Assign the buffer object to a_Position variable
      gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
    
      // Enable the assignment to a_Position variable
      gl.enableVertexAttribArray(a_Position);
    
      gl.drawArrays(gl.TRIANGLES, 0, n);
      //return n;
    }
    
    drawTriangle3D() {
      
      var n = 3; // The number of vertices
    
      // Create a buffer object
      if (this.buffer === null) {
        this.buffer = gl.createBuffer();
        if (!this.buffer) {
          console.log('Failed to create the buffer object');
          return -1;
        }
      }

      //var vertexBuffer = gl.createBuffer();
      //if (!vertexBuffer) {
      //      console.log('Failed to create the buffer object');
      //      return -1;
      //}
    
    
      // Bind the buffer object to target
      gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
      // Write date into the buffer object
      gl.bufferData(gl.ARRAY_BUFFER, 
        new Float32Array(this.vertices), 
        gl.DYNAMIC_DRAW);
      //gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    
      // Assign the buffer object to a_Position variable
      gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
    
      // Enable the assignment to a_Position variable
      gl.enableVertexAttribArray(a_Position);
    
      gl.drawArrays(gl.TRIANGLES, 0, n);
      //return n;
    }

    drawTriangle3DUV() {
      
      var n = 3; // The number of vertices
    
      // Create a buffer object for vertices
      if (this.buffer === null) {
        this.buffer = gl.createBuffer();
        if (!this.buffer) {
          console.log('Failed to create the buffer object');
          return -1;
        }
      }
    
      // Bind the buffer object to target
      gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
      // Write date into the buffer object
      gl.bufferData(gl.ARRAY_BUFFER, 
        new Float32Array(this.vertices), 
        gl.DYNAMIC_DRAW);
      //gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    
      // Assign the buffer object to a_Position variable
      gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
    
      // Enable the assignment to a_Position variable
      gl.enableVertexAttribArray(a_Position);

      //------
      // create a buffer object for UV
      // Create a buffer object
      if (this.bufferUV === null) {
        this.bufferUV = gl.createBuffer();
        if (!this.bufferUV) {
          console.log('Failed to create the bufferUV object');
          return -1;
        }
      }

      // Bind the buffer object to target
      gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferUV);
      // Write date into the buffer object
      gl.bufferData(gl.ARRAY_BUFFER, 
        new Float32Array(this.uv), 
        gl.DYNAMIC_DRAW);
    
      // Assign the buffer object to a_Position variable
      gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, 0, 0);
    
      // Enable the assignment to a_Position variable
      gl.enableVertexAttribArray(a_UV);
    

      //draw the triangle
      gl.drawArrays(gl.TRIANGLES, 0, n);
      
    }
    
  }


