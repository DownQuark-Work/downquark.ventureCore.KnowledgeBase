
## Basic Turtle Functions
#####
# Python Function => Description
# goto(x, y) => Moves the turtle to the x, y coordinates.
# setheading(deg) => Sets the turtle’s heading. In Python, 0 degrees is east (right). In JavaScript, 0 degrees is north (up).
# forward(steps) => Moves the turtle a number of steps forward in the heading it is facing.
# backward(steps) => Moves the turtle a number of steps in the heading opposite from the one it is facing.
# left(deg) => Turns the turtle’s heading to the left.
# right(deg) => Turns the turtle’s heading to the right.
# penup() => “Raises the pen” so that the turtle stops drawing as it moves.
# pendown() => “Lowers the pen” so that the turtle starts drawing as it moves.
# pensize(size) => Changes the thickness of the lines the turtle draws. The default is 1.
# pencolor(color) => Changes the color of the lines the turtle draws. This can be a string of a common color such as red or white. The default is black.
# xcor() => Returns the turtle’s current x position.
# ycor() => Returns the turtle’s current y position.
# heading() => Returns the turtle’s current heading as a floating-point number from 0 to 359. In Python, 0 degrees is east (right). In JavaScript, 0 degrees is north (up).
# reset() => Clears any drawn lines, and moves the turtle back to the original position and heading.
# clear() => Clears any drawn lines but doesn’t move the turtle.
# -----
# begin_fill() => Begins drawing a filled-in shape. The lines drawn after this call will specify the perimeter of the filled-in shape.
# end_fill() => Draws the filled-in shape that was started with the call to turtle.begin_fill().
# fillcolor(color) => Sets the color used for filled-in shapes.
# hideturtle() => Hides the triangle that represents the turtle.
# showturtle() => Shows the triangle that represents the turtle.
# tracer(drawingUpdates, delay) => Adjusts the speed of drawing. Pass 0 for delay for a delay of 0 milliseconds after each line the turtle draws. The larger the number passed for drawingUpdates, the faster the turtle draws by increasing the number of drawings before the module updates the screen.
# update() => Draws any buffered lines (explained later in this section) to the screen. Call this after the turtle has completed drawing.
# setworldcoordinates(llx, lly, urx, ury) => Readjusts which part of the coordinate plane the window shows. The first two arguments are the x, y coordinates for the lower-left corner of the window. The latter two arguments are the x, y coordinates for the upper-right corner of the window.
# exitonclick() => Pauses the program and closes the window when the user clicks anywhere. Without this at the end of your program, the turtle graphics window may close as soon as the program ends.
#####
