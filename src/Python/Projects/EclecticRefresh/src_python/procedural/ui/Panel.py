# https://docs.python.org/3/library/tk.html
# https://docs.python.org/3/library/tkinter.html
# % python3.12 -m tkinter # from command line launches basic panel to prove correct install
# - https://tcl.tk/man/tcl8.6/TkCmd/contents.htm
# - https://tkdocs.com/pyref/index.html
# >> https://github.com/roseman/tkdocs

# WIDGET INTROSPECTION
# `https://tcl.tk/man/tcl8.6/ItclCmd/itclwidget.htm`
# ```
# print_hierarchy(root)

# def print_hierarchy(w, depth=0):
#     print('  '*depth + w.winfo_class() + ' w=' + str(w.winfo_width()) + ' h=' + str(w.winfo_height()) + ' x=' + str(w.winfo_x()) + ' y=' + str(w.winfo_y()))
#     for i in w.winfo_children():
#         print_hierarchy(i, depth+1)
# ```
# The following are some of the most useful methods:
#
# winfo_class: a class identifying the type of widget, e.g., TButton for a themed button
# winfo_children: a list of widgets that are the direct children of a widget in the hierarchy
# winfo_parent: parent of the widget in the hierarchy
# winfo_toplevel: the toplevel window containing this widget
# winfo_width, winfo_height: current width and height of the widget; not accurate until it appears onscreen
# winfo_reqwidth, winfo_reqheight: the width and height that the widget requests of the geometry manager (more on this shortly)
# winfo_x, winfo_y: the position of the top-left corner of the widget relative to its parent
# winfo_rootx, winfo_rooty: the position of the top-left corner of the widget relative to the entire screen
#
# # EASY LOOKUP LINK:
# # https://tcl.tk/man/tcl8.6/Keywords/T.htm
#
# ORGANIZATION REFERENCE:
# # https://tkdocs.com/tutorial/complex.html
#
# WINDOW  CREATION:
# # https://tkdocs.com/tutorial/windows.html
# # https://tkdocs.com/tutorial/canvas.html
# # https://tcl.tk/man/tcl8.6/TkCmd/canvas.htm <<- full docs
# # https://tkdocs.com/pyref/canvas.html <<- full docs on a less intense UI
#
# LAYOUT RELATED INFO HERE:
# # `tree = ttk.Treeview(root)`
# # https://tkdocs.com/tutorial/styles.html
# # https://tkdocs.com/tutorial/widgets.html
# # https://tkdocs.com/tutorial/fonts.html
#
# GRID REFERNECE DOC
# # https://tcl.tk/man/tcl8.6/TkCmd/grid.htm
#
# EVELNT LOOP: https://tkdocs.com/tutorial/eventloop.html
#
#
# BINDABLE EVENTS
# <Activate>: Window has become active.
# <Deactivate>: Window has been deactivated.
# <MouseWheel>: Scroll wheel on mouse has been moved.
# <KeyPress>: Key on keyboard has been pressed down.
# <KeyRelease>: Key has been released.
# <ButtonPress>: A mouse button has been pressed.
# <ButtonRelease>: A mouse button has been released.
# <Motion>: Mouse has been moved.
# <Configure>: Widget has changed size or position.
# <Destroy>: Widget is being destroyed.
# <FocusIn>: Widget has been given keyboard focus.
# <FocusOut>: Widget has lost keyboard focus.
# <Enter>: Mouse pointer enters widget.
# <Leave>: Mouse pointer leaves widget.
#
# # Tk also defines virtual events for common operations that are triggered in different ways for different platforms.
#    These include <<Cut>>, <<Copy>> and <<Paste>>.
#
# # Define your own events:
# root.event_generate("<<MyOwnEvent>>")

############
# https://docs.python.org/3/library/idle.html # IDLE is Python’s Integrated Development and Learning Environment.
# https://tkdocs.com/tutorial/idle.html
