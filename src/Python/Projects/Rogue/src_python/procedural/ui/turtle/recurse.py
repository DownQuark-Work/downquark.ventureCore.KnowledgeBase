import math
import random
import time
import turtle

from time import sleep

# https://docs.python.org/3/library/turtle.html
# https://github.com/asweigart/simple-turtle-tutorial-for-python/blob/master/simple_turtle_tutorial.md#beginning-with-turtle.py
# https://inventwithpython.com/recursion/chapter9.html

class Trtle:
    def __init__(self):
        print('turtle graphics')

    @classmethod
    def SimpleSpiral(cls):
        turtle.tracer(1, 0)  # Makes the turtle draw faster.
        for i in range(360):
            turtle.forward(i)
            turtle.left(59)
        turtle.exitonclick()  # Pause until user clicks in the window.

    @classmethod
    def BranchingTree(cls):
        turtle.tracer(1000, 0)  # Increase the first argument to speed up the drawing.
        turtle.setworldcoordinates(0, 0, 700, 700)
        turtle.hideturtle()

        def drawBranch(startPosition, direction, branchLength):
            if branchLength < 5:
                # BASE CASE
                return

            # Go to the starting point & direction.
            turtle.penup()
            turtle.goto(startPosition)
            turtle.setheading(direction)

            # Draw the branch (thickness is 1/7 the length).
            turtle.pendown()
            turtle.pensize(max(branchLength / 7.0, 1))
            turtle.forward(branchLength)

            # Record the position of the branch's end.
            endPosition = turtle.position()
            leftDirection = direction + LEFT_ANGLE
            leftBranchLength = branchLength - LEFT_DECREASE
            rightDirection = direction - RIGHT_ANGLE
            rightBranchLength = branchLength - RIGHT_DECREASE

            # RECURSIVE CASE
            drawBranch(endPosition, leftDirection, leftBranchLength)
            drawBranch(endPosition, rightDirection, rightBranchLength)

        seed = 0
        while True:
            # Get pseudorandom numbers for the branch properties.
            random.seed(seed)
            LEFT_ANGLE = random.randint(10, 30)
            LEFT_DECREASE = random.randint(8, 15)
            RIGHT_ANGLE = random.randint(10, 30)
            RIGHT_DECREASE = random.randint(8, 15)
            START_LENGTH = random.randint(80, 120)

            # Write out the seed number.
            turtle.clear()
            turtle.penup()
            turtle.goto(10, 10)
            turtle.write('Seed: %s' % (seed))

            # Draw the tree.
            drawBranch((350, 10), 90, START_LENGTH)
            turtle.update()
            time.sleep(2)

            seed = seed + 1

    @classmethod
    def HilbertCurve(cls):
        turtle.tracer(10, 0)  # Increase the first argument to speed up the drawing.
        turtle.setworldcoordinates(0, 0, 700, 700)
        turtle.hideturtle()

        LINE_LENGTH = 5  # Try changing the line length by a little.
        ANGLE = 90  # Try changing the turning angle by a few degrees.
        LEVELS = 6  # Try changing the recursive level by a little.
        DRAW_SOLID = False

        # turtle.setheading(20) # Uncomment this line to draw the curve at an angle.

        def hilbertCurveQuadrant(level, angle):
            if level == 0:
                # BASE CASE
                return
            else:
                # RECURSIVE CASE
                turtle.right(angle)
                hilbertCurveQuadrant(level - 1, -angle)
                turtle.forward(LINE_LENGTH)
                turtle.left(angle)
                hilbertCurveQuadrant(level - 1, angle)
                turtle.forward(LINE_LENGTH)
                hilbertCurveQuadrant(level - 1, angle)
                turtle.left(angle)
                turtle.forward(LINE_LENGTH)
                hilbertCurveQuadrant(level - 1, -angle)
                turtle.right(angle)
                return

        def hilbertCurve(startingPosition):
            # Move to starting position.
            turtle.penup()
            turtle.goto(startingPosition)
            turtle.pendown()
            if DRAW_SOLID:
                turtle.begin_fill()

            hilbertCurveQuadrant(LEVELS, ANGLE)  # Draw lower-left quadrant.
            turtle.forward(LINE_LENGTH)

            hilbertCurveQuadrant(LEVELS, ANGLE)  # Draw lower-right quadrant.
            turtle.left(ANGLE)
            turtle.forward(LINE_LENGTH)
            turtle.left(ANGLE)

            hilbertCurveQuadrant(LEVELS, ANGLE)  # Draw upper-right quadrant.
            turtle.forward(LINE_LENGTH)

            hilbertCurveQuadrant(LEVELS, ANGLE)  # Draw upper-left quadrant.

            turtle.left(ANGLE)
            turtle.forward(LINE_LENGTH)
            turtle.left(ANGLE)
            if DRAW_SOLID:
                turtle.end_fill()

        hilbertCurve((30, 350))
        turtle.exitonclick()

    @classmethod
    def KochFlake(cls):
        turtle.tracer(10, 0)  # Increase the first argument to speed up the drawing.
        turtle.setworldcoordinates(0, 0, 700, 700)
        turtle.hideturtle()
        turtle.pensize(2)

        def drawKochCurve(startPosition, heading, length):
            if length < 1:
                # BASE CASE
                return
            else:
                # RECURSIVE CASE
                # Move to the start position.
                recursiveArgs = []
                turtle.penup()
                turtle.goto(startPosition)
                turtle.setheading(heading)
                recursiveArgs.append({'position': turtle.position(),
                                      'heading': turtle.heading()})

                # Erase the middle third.
                turtle.forward(length / 3)
                turtle.pencolor('white')
                turtle.pendown()
                turtle.forward(length / 3)

                # Draw the bump.
                turtle.backward(length / 3)
                turtle.left(60)
                recursiveArgs.append({'position': turtle.position(),
                                      'heading': turtle.heading()})
                turtle.pencolor('black')
                turtle.forward(length / 3)
                turtle.right(120)
                recursiveArgs.append({'position': turtle.position(),
                                      'heading': turtle.heading()})
                turtle.forward(length / 3)
                turtle.left(60)
                recursiveArgs.append({'position': turtle.position(),
                                      'heading': turtle.heading()})

                for i in range(4):
                    drawKochCurve(recursiveArgs[i]['position'],
                                  recursiveArgs[i]['heading'],
                                  length / 3)
                return

        def drawKochSnowflake(startPosition, heading, length):
            # A Koch snowflake is three Koch curves in a triangle.

            # Move to the starting position.
            turtle.penup()
            turtle.goto(startPosition)
            turtle.setheading(heading)

            for i in range(3):
                # Record the starting position and heading.
                curveStartingPosition = turtle.position()
                curveStartingHeading = turtle.heading()
                drawKochCurve(curveStartingPosition,
                              curveStartingHeading, length)

                # Move back to the start position for this side.
                turtle.penup()
                turtle.goto(curveStartingPosition)
                turtle.setheading(curveStartingHeading)

                # Move to the start position of the next side.
                turtle.forward(length)
                turtle.right(120)

        drawKochSnowflake((100, 500), 0, 500)
        turtle.exitonclick()

    @classmethod
    def Sierpinski(cls, render_type):
        if render_type == 'TRIANGLE':
            MIN_SIZE = 4  # Try changing this to decrease/increase the amount of recursion.

            turtle.tracer(100, 0)  # Increase the first argument to speed up the drawing. (stores 100 lines in memory before drawing)
            turtle.setworldcoordinates(0, 0, 700, 700)
            turtle.hideturtle()
            # sleep(3) # delay before draw

            def midpoint(startx, starty, endx, endy):
                # Return the x, y coordinate in the middle of the four given parameters.
                xDiff = abs(startx - endx)
                yDiff = abs(starty - endy)
                return (min(startx, endx) + (xDiff / 2.0), min(starty, endy) + (yDiff / 2.0))

            def isTooSmall(ax, ay, bx, by, cx, cy):
                # Determine if the triangle is too small to draw.
                width = max(ax, bx, cx) - min(ax, bx, cx)
                height = max(ay, by, cy) - min(ay, by, cy)
                return width < MIN_SIZE or height < MIN_SIZE

            def drawTriangle(ax, ay, bx, by, cx, cy):
                if isTooSmall(ax, ay, bx, by, cx, cy):
                    return # BASE CASE
                else: # RECURSIVE CASE
                    turtle.penup()
                    turtle.goto(ax, ay)
                    turtle.pendown()
                    turtle.goto(bx, by)
                    turtle.goto(cx, cy)
                    turtle.goto(ax, ay)
                    turtle.penup()

                    # Calculate midpoints between points A, B, and C.
                    mid_ab = midpoint(ax, ay, bx, by)
                    mid_bc = midpoint(bx, by, cx, cy)
                    mid_ca = midpoint(cx, cy, ax, ay)

                    # Draw the three inner triangles.
                    drawTriangle(ax, ay, mid_ab[0], mid_ab[1], mid_ca[0], mid_ca[1])
                    drawTriangle(mid_ab[0], mid_ab[1], bx, by, mid_bc[0], mid_bc[1])
                    drawTriangle(mid_ca[0], mid_ca[1], mid_bc[0], mid_bc[1], cx, cy)
                    return

            # Draw an equilateral Sierpinski triangle.
            drawTriangle(50, 50, 350, 650, 650, 50)
            # Draw a skewed Sierpinski triangle.
            # drawTriangle(30, 250, 680, 600, 500, 80)

        if render_type == 'CARPET':
            MIN_SIZE = 6  # Try changing this to decrease/increase the amount of recursion.
            DRAW_SOLID = True  # False

            turtle.tracer(10, 0)  # Increase the first argument to speed up the drawing.
            turtle.setworldcoordinates(0, 0, 700, 700)
            turtle.hideturtle()

            def isTooSmall(width, height):
                # Determine if the rectangle is too small to draw.
                return width < MIN_SIZE or height < MIN_SIZE

            def drawCarpet(x, y, width, height):
                # The x and y are the lower-left corner of the carpet.
                # Move the pen into position.
                turtle.penup()
                turtle.goto(x, y)

                # Draw the outer rectangle.
                turtle.pendown()
                if DRAW_SOLID:
                    turtle.fillcolor('black')
                    turtle.begin_fill()
                turtle.goto(x, y + height)
                turtle.goto(x + width, y + height)
                turtle.goto(x + width, y)
                turtle.goto(x, y)
                if DRAW_SOLID:
                    turtle.end_fill()
                turtle.penup()

                # Draw the inner rectangles.
                drawInnerRectangle(x, y, width, height)

            def drawInnerRectangle(x, y, width, height):
                if isTooSmall(width, height):
                    return # BASE CASE
                else: # RECURSIVE CASE
                    oneThirdWidth = width / 3
                    oneThirdHeight = height / 3
                    twoThirdsWidth = 2 * (width / 3)
                    twoThirdsHeight = 2 * (height / 3)

                    # Move into position.
                    turtle.penup()
                    turtle.goto(x + oneThirdWidth, y + oneThirdHeight)

                    # Draw the inner rectangle.
                    if DRAW_SOLID:
                        turtle.fillcolor('white')
                        turtle.begin_fill()
                    turtle.pendown()
                    turtle.goto(x + oneThirdWidth, y + twoThirdsHeight)
                    turtle.goto(x + twoThirdsWidth, y + twoThirdsHeight)
                    turtle.goto(x + twoThirdsWidth, y + oneThirdHeight)
                    turtle.goto(x + oneThirdWidth, y + oneThirdHeight)
                    turtle.penup()
                    if DRAW_SOLID:
                        turtle.end_fill()

                    # Draw the inner rectangles across the top.
                    drawInnerRectangle(x, y + twoThirdsHeight, oneThirdWidth, oneThirdHeight)
                    drawInnerRectangle(x + oneThirdWidth, y + twoThirdsHeight, oneThirdWidth, oneThirdHeight)
                    drawInnerRectangle(x + twoThirdsWidth, y + twoThirdsHeight, oneThirdWidth, oneThirdHeight)

                    # Draw the inner rectangles across the middle.
                    drawInnerRectangle(x, y + oneThirdHeight, oneThirdWidth,
                                       oneThirdHeight)
                    drawInnerRectangle(x + twoThirdsWidth, y + oneThirdHeight, oneThirdWidth,
                                       oneThirdHeight)

                    # Draw the inner rectangles across the bottom.
                    drawInnerRectangle(x, y, oneThirdWidth, oneThirdHeight)
                    drawInnerRectangle(x + oneThirdWidth, y, oneThirdWidth, oneThirdHeight)
                    drawInnerRectangle(x + twoThirdsWidth, y, oneThirdWidth,
                                       oneThirdHeight)
            drawCarpet(50, 50, 600, 600)

        turtle.exitonclick()

    @classmethod
    def UlamSpiral(cls):
        # The Ulam spiral is a mysterious mathematics pattern for prime numbers
        # with turtle graphics.
        # More info at https://en.wikipedia.org/wiki/Ulam_spiral

        turtle.tracer(100, 0)  # Make the turtle draw faster.

        SPACING = 3
        DOT_SIZE = 4

        turtle.bgcolor('#353337')  # Use a dark background color.
        turtle.pencolor('#CCCCCC')  # The spiral is a light gray color.

        def amountOfDivisors(number):
            # Return the number of divisors for `number`.
            total = 0
            for i in range(2, int(math.sqrt(number)) + 1):
                # If i evenly divides number with no remainder, increase total.
                if number % i == 0:
                    total += 1
            return total

        # (!) Comment this next line to draw the spiral.
        turtle.penup()
        turtle.forward(SPACING)  # 1 is not prime, so skip
        turtle.left(90)
        turtle.dot(DOT_SIZE)  # 2 is prime, so make a dot
        turtle.forward(SPACING)
        turtle.left(90)

        currentNumber = 3  # This is the number we test for primality.
        spiralSideLength = 3
        while currentNumber < 40000:
            # We draw two sides before increasing the spiral side length:
            for i in range(2):
                for j in range(spiralSideLength):
                    divs = amountOfDivisors(currentNumber)
                    currentNumber += 1

                    if divs == 0:
                        # Mark the prime number
                        turtle.dot(DOT_SIZE, '#76b7eb')
                    turtle.forward(SPACING)
                turtle.left(90)
            spiralSideLength += 1

        turtle.update()  # Finish drawing the screen.
        turtle.exitonclick()  # When user clicks on the window, close it.

    @classmethod
    def VariedFractal(cls,fractal_type:int=1):
        # DRAW_FRACTAL = 1  # Set to 1 through 11 and run the program.
        DRAW_FRACTAL =  (fractal_type%11)+1  # Set to 1 through 11 and run the program.

        turtle.tracer(5000, 0)  # Increase the first argument to speed up the drawing.
        turtle.hideturtle()

        def drawFilledSquare(size, depth):
            size = int(size)

            # Move to the top-right corner before drawing:
            turtle.penup()
            turtle.forward(size // 2)
            turtle.left(90)
            turtle.forward(size // 2)
            turtle.left(180)
            turtle.pendown()

            # Alternate between white and gray (with black border):
            if depth % 2 == 0:
                turtle.pencolor('black')
                turtle.fillcolor('white')
            else:
                turtle.pencolor('black')
                turtle.fillcolor('gray')

            # Draw a square:
            turtle.begin_fill()
            for i in range(4):  # Draw four lines.
                turtle.forward(size)
                turtle.right(90)
            turtle.end_fill()

        def drawTriangleOutline(size, depth):
            size = int(size)

            # Move the turtle to the top of the equilateral triangle:
            height = size * math.sqrt(3) / 2
            turtle.penup()
            turtle.left(90)  # Turn to face upward.
            turtle.forward(height * (2 / 3))  # Move to the top corner.
            turtle.right(150)  # Turn to face the bottom-right corner.
            turtle.pendown()

            # Draw the three sides of the triangle:
            for i in range(3):
                turtle.forward(size)
                turtle.right(120)

        def drawFractal(shapeDrawFunction, size, specs, maxDepth=8, depth=0):
            if depth > maxDepth or size < 1:
                return  # BASE CASE

            # Save the position and heading at the start of this function call:
            initialX = turtle.xcor()
            initialY = turtle.ycor()
            initialHeading = turtle.heading()

            # Call the draw function to draw the shape:
            turtle.pendown()
            shapeDrawFunction(size, depth)
            turtle.penup()

            # RECURSIVE CASE
            for spec in specs:
                # Each dictionary in specs has keys 'sizeChange', 'xChange',
                # 'yChange', and 'angleChange'. The size, x, and y changes
                # are multiplied by the size parameter. The x change and y
                # change are added to the turtle's current position. The angle
                # change is added to the turtle's current heading.
                sizeCh = spec.get('sizeChange', 1.0)
                xCh = spec.get('xChange', 0.0)
                yCh = spec.get('yChange', 0.0)
                angleCh = spec.get('angleChange', 0.0)

                # Reset the turtle to the shape's starting point:
                turtle.goto(initialX, initialY)
                turtle.setheading(initialHeading + angleCh)
                turtle.forward(size * xCh)
                turtle.left(90)
                turtle.forward(size * yCh)
                turtle.right(90)

                # Make the recursive call:
                drawFractal(shapeDrawFunction, size * sizeCh, specs, maxDepth,
                            depth + 1)

        if DRAW_FRACTAL == 1:
            # Four Corners:
            drawFractal(drawFilledSquare, 350,
                        [{'sizeChange': 0.5, 'xChange': -0.5, 'yChange': 0.5},
                         {'sizeChange': 0.5, 'xChange': 0.5, 'yChange': 0.5},
                         {'sizeChange': 0.5, 'xChange': -0.5, 'yChange': -0.5},
                         {'sizeChange': 0.5, 'xChange': 0.5, 'yChange': -0.5}], 5)
        elif DRAW_FRACTAL == 2:
            # Spiral Squares:
            drawFractal(drawFilledSquare, 600, [{'sizeChange': 0.95,
                                                 'angleChange': 7}], 50)
        elif DRAW_FRACTAL == 3:
            # Double Spiral Squares:
            drawFractal(drawFilledSquare, 600,
                        [{'sizeChange': 0.8, 'yChange': 0.1, 'angleChange': -10},
                         {'sizeChange': 0.8, 'yChange': -0.1, 'angleChange': 10}])
        elif DRAW_FRACTAL == 4:
            # Triangle Spiral:
            drawFractal(drawTriangleOutline, 20,
                        [{'sizeChange': 1.05, 'angleChange': 7}], 80)
        elif DRAW_FRACTAL == 5:
            # Conway's Game of Life Glider:
            third = 1 / 3
            drawFractal(drawFilledSquare, 600,
                        [{'sizeChange': third, 'yChange': third},
                         {'sizeChange': third, 'xChange': third},
                         {'sizeChange': third, 'xChange': third, 'yChange': -third},
                         {'sizeChange': third, 'yChange': -third},
                         {'sizeChange': third, 'xChange': -third, 'yChange': -third}])
        elif DRAW_FRACTAL == 6:
            # Sierpiński Triangle:
            toMid = math.sqrt(3) / 6
            drawFractal(drawTriangleOutline, 600,
                        [{'sizeChange': 0.5, 'yChange': toMid, 'angleChange': 0},
                         {'sizeChange': 0.5, 'yChange': toMid, 'angleChange': 120},
                         {'sizeChange': 0.5, 'yChange': toMid, 'angleChange': 240}])
        elif DRAW_FRACTAL == 7:
            # Wave:
            drawFractal(drawTriangleOutline, 280,
                        [{'sizeChange': 0.5, 'xChange': -0.5, 'yChange': 0.5},
                         {'sizeChange': 0.3, 'xChange': 0.5, 'yChange': 0.5},
                         {'sizeChange': 0.5, 'yChange': -0.7, 'angleChange': 15}])
        elif DRAW_FRACTAL == 8:
            # Horn:
            drawFractal(drawFilledSquare, 100,
                        [{'sizeChange': 0.96, 'yChange': 0.5, 'angleChange': 11}], 100)
        elif DRAW_FRACTAL == 9:
            # Snowflake:
            drawFractal(drawFilledSquare, 200,
                        [{'xChange': math.cos(0 * math.pi / 180),
                          'yChange': math.sin(0 * math.pi / 180), 'sizeChange': 0.4},
                         {'xChange': math.cos(72 * math.pi / 180),
                          'yChange': math.sin(72 * math.pi / 180), 'sizeChange': 0.4},
                         {'xChange': math.cos(144 * math.pi / 180),
                          'yChange': math.sin(144 * math.pi / 180), 'sizeChange': 0.4},
                         {'xChange': math.cos(216 * math.pi / 180),
                          'yChange': math.sin(216 * math.pi / 180), 'sizeChange': 0.4},
                         {'xChange': math.cos(288 * math.pi / 180),
                          'yChange': math.sin(288 * math.pi / 180), 'sizeChange': 0.4}])
        elif DRAW_FRACTAL == 10:
            # The filled square shape:
            turtle.tracer(1, 0)
            drawFilledSquare(400, 0)
        elif DRAW_FRACTAL == 11:
            # The triangle outline shape:
            turtle.tracer(1, 0)
            drawTriangleOutline(400, 0)
        else:
            assert False, 'Set DRAW_FRACTAL to a number from 1 to 11.'

        turtle.exitonclick()  # Click the window to exit.

# Trtle.SimpleSpiral()
# Trtle.BranchingTree()
# Trtle.HilbertCurve()
# Trtle.KochFlake()
# Trtle.Sierpinski('TRIANGLE')
# Trtle.Sierpinski('CARPET')
# Trtle.UlamSpiral()
# Trtle.VariedFractal(0) # accepts range 0-10
print('make sure to run a fnc')
