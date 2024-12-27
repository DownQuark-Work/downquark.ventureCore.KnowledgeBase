from tkinter import *
from tkinter import ttk

# py src_python/procedural/ui/example_class.py

# winfo reference
# ---
# winfo_class:
#    a class identifying the type of widget, e.g., TButton for a themed button
# winfo_children:
#    a list of widgets that are the direct children of a widget in the hierarchy
# winfo_parent:
#    parent of the widget in the hierarchy
# winfo_toplevel:
#    the toplevel window containing this widget
# winfo_width, winfo_height:
#    current width and height of the widget; not accurate until it appears onscreen
# winfo_reqwidth, winfo_reqheight:
#    the width and height that the widget requests of the geometry manager (more on this shortly)
# winfo_x, winfo_y:
#    the position of the top-left corner of the widget relative to its parent
# winfo_rootx, winfo_rooty:
#    the position of the top-left corner of the widget relative to the entire screen
# winfo_vieweable:
#    whether the widget is displayed or hidden (all its ancestors in the hierarchy must be viewable for it to be viewable)

# event binding reference:
# ---
# <Activate>:
#    Window has become active.
# <Deactivate>:
#    Window has been deactivated.
# <MouseWheel>:
#    Scroll wheel on mouse has been moved.
# <KeyPress>:
#    Key on keyboard has been pressed down.
# <KeyRelease>:
#    Key has been released.
# <ButtonPress>:
#    A mouse button has been pressed.
# <ButtonRelease>:
#    A mouse button has been released.
# <Motion>:
#    Mouse has been moved.
# <Configure>:
#    Widget has changed size or position.
# <Destroy>:
#    Widget is being destroyed.
# <FocusIn>:
#    Widget has been given keyboard focus.
# <FocusOut>:
#    Widget has lost keyboard focus.
# <Enter>:
#    Mouse pointer enters widget.
# <Leave>:
#    Mouse pointer leaves widget.
#
#### Mouse button clicks can be more specific if required:
# <ButtonPress-1> Clicked left mouse button
# <3> Clicked right mouse button
# <Double-1> Double-clicked left mouse button
#### For keyboard binding - https://tcl.tk/man/tcl8.6/TkCmd/keysyms.htm
# <KeyPress-a> === <a>
#### Virtual Events
# <<ListboxSelect>> | <<Cut>> | <<Copy>> | <<Paste>>
## Custom Virtual Events
# `root.event_generate("<<MyOwnEvent>>")`



class FeetToMeters:

    def __init__(self, root):

        root.title("Feet to Meters")

        mainframe = ttk.Frame(root, padding="3 3 12 12")
        mainframe.grid(column=0, row=0, sticky=(N, W, E, S))
        root.columnconfigure(0, weight=1)
        root.rowconfigure(0, weight=1)
        ## below weights mean on resize each 1px col1 and row0 grow, col2 and row2 will grow 3px
        # mainframe.columnconfigure(1, weight=1)
        # mainframe.columnconfigure(2, weight=3)
        # mainframe.rowconfigure(0, weight=1)
        # mainframe.rowconfigure(2, weight=3)


        self.feet = StringVar()
        feet_entry = ttk.Entry(mainframe, width=7, textvariable=self.feet)
        feet_entry.grid(column=2, row=1, sticky=(W,E))
        self.meters = StringVar()

        ttk.Label(mainframe, textvariable=self.meters).grid(column=2, row=2, sticky=(W, E))
        # long hand
        btn = ttk.Button(mainframe, text="Calculate", command=self.calculate)
        btn.grid(column=3, row=3, sticky=W)
        # btn['padding'] = 5  # 5 pixels on all sides
        # btn['padding'] = (5, 10)  # 5 on left and right, 10 on top and bottom
        # btn['padding'] = (5, 7, 10, 12)  # left: 5, top: 7, right: 10, bottom: 12
        #### Button states
        # btn.state(['disabled'])  # set the disabled flag
        # btn.state(['!disabled'])  # clear the disabled flag
        # btn.instate(['disabled'])  # true if disabled, else false
        # btn.instate(['!disabled'])  # true if not disabled, else false
        # btn.instate(['!disabled'], cmd)  # execute 'cmd' if not disabled

        ## checkbox example
        # measureSystem = StringVar()
        # check = ttk.Checkbutton(parent, text='Use Metric',
        #                         command=metricChanged, variable=measureSystem,
        #                         onvalue='metric', offvalue='imperial')

        ## radio example
        # phone = StringVar()
        # home = ttk.Radiobutton(parent, text='Home', variable=phone, value='home')
        # office = ttk.Radiobutton(parent, text='Office', variable=phone, value='office')
        # cell = ttk.Radiobutton(parent, text='Mobile', variable=phone, value='cell')

        ## combobox example
        # countryvar = StringVar()
        # country = ttk.Combobox(parent, textvariable=countryvar)
        # country.bind('<<ComboboxSelected>>', function)
        # country['values'] = ('USA', 'Canada', 'Australia')

        ## listbox
        # choices = ["apple", "orange", "banana"]
        # choicesvar = StringVar(value=choices)
        # lbox = Listbox(parent, listvariable=choicesvar)
        # choices.append("peach")
        # choicesvar.set(choices)
        ### if lbox.selection_includes("apple"): print("apple in selection")
        ### if lbox.selection_includes(1): print("1 in selection")
        ### lbox.selection_set(idx); lbox.see(idx);
        # lbox.bind("<<ListboxSelect>>", lambda e: updateDetails(lbox.curselection()))
        # lbox.bind("<Double-1>", lambda e: invokeAction(lbox.curselection()))


        ## scrollbar
        # sbar = ttk.Scrollbar(parent, orient=VERTICAL, command=lbox.yview)
        ### use with listbox above
        # lbox.configure(yscrollcommand=sbar.set)

        ## text
        # txt = Text(parent, width=40, height=10)
        # txt['state'] = 'disabled'

        ## scale
        # num = StringVar()
        # def update_lbl(val):
        #   print("Scale at " + val)
        # ## Because 'from' is a reserved keyword in Python, we need to add a trailing underscore when using it as a configuration option.
        # scl = ttk.Scale(root, orient='horizontal', length=200, from_=1.0, to=100.0, variable=num, command=update_lbl)
        # scl.grid(column=0, row=2, sticky='we')
        # scl.set(20)

        ##spinbox
        # spinval = StringVar()
        # spnbx = ttk.Spinbox(parent, from_=1.0, to=100.0, textvariable=spinval)
        # spnbx.state(['readonly'])

        ## progressbar
        # pbar = ttk.Progressbar(parent, orient=HORIZONTAL, length=200, mode='determinate')

        ## password example
        # password = StringVar()
        # pw = ttk.Entry(mainframe, textvariable=password, show="*").grid(column=0,row=0, sticky=(N,E))

        ## validation example
        # import re
        # def check_num(newval):
        #     return re.match('^[0-9]*$', newval) is not None and len(newval) <= 5
        # check_num_wrapper = (root.register(check_num), '%P')
        # num = StringVar()
        # e = ttk.Entry(root, textvariable=num, validate='key', validatecommand=check_num_wrapper)
        # e.grid(column=0, row=0, sticky='we')

        ttk.Label(mainframe, text="feet").grid(column=3, row=1, sticky=W)
        ttk.Label(mainframe, text="is equivalent to").grid(column=1, row=2, sticky=E)
        ttk.Label(mainframe, text="meters").grid(column=3, row=2, sticky=W)
        # Image label
        # ttk.Label(mainframe, text="- with image -").grid(column=1, row=1, sticky=W)
        # image = PhotoImage(file='myimage.gif')
        # label['image'] = image

        # print('mainframe.winfo_children()',mainframe.winfo_children())
        for child in mainframe.winfo_children():
            child.grid_configure(padx=5, pady=5)
            # print('str(widget)', str(child))

        # def it_has_been_written(*args): # on change event
        #     print('written', args, self.feet.get())
        # self.feet.trace_add("write", it_has_been_written)

        feet_entry.focus()
        root.bind("<Return>", self.calculate)
        ## equivalent to:
        # root.bind("<Return>", lambda e: btn.invoke())


        def print_hierarchy(w, depth=0):
            print(
                '  ' * depth + w.winfo_class() + ' w=' + str(w.winfo_width()) + ' h=' + str(
                    w.winfo_height()) + ' x=' + str(
                    w.winfo_x()) + ' y=' + str(w.winfo_y()))
            for i in w.winfo_children():
                print_hierarchy(i, depth + 1)

        print_hierarchy(root)
        print(' button.configure()', btn.configure(), btn['command'])


    def calculate(self, *args):
        try:
            value = float(self.feet.get())
            self.meters.set(int(0.3048 * value * 10000.0 + 0.5) / 10000.0)
        except ValueError:
            pass


root = Tk()
FeetToMeters(root)
root.mainloop()
