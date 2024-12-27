from tkinter import *
from tkinter import ttk, messagebox, filedialog

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

        # could be useful for a splash screen or something
        # root.minsize(200, 100)
        # root.maxsize(500, 500)
        # root.attributes("-alpha", 0.85)

        ## set to fullscreen:
        # root.attributes("-fullscreen", 1)
        ## https://wiki.tcl-lang.org/page/MacWindowStyle - mac specific styles

        ## hide and show window without killing process
        # root.state('normal')
        # root.iconify()
        # root.deiconify()
        # root.withdraw()
        ###
        # For document-centric applications, where you want to allow closing any window without the application exiting
        # (as would happen if you destroy the root window), use withdraw on the root window to remove it from the screen,
        # use new toplevel windows for your user interface.
        ###
        # print('root.state',root.state())

        mainframe = ttk.Frame(root, padding="3 3 12 12")
        mainframe.grid(column=0, row=0, sticky=(N, W, E, S))
        root.columnconfigure(0, weight=1)
        root.rowconfigure(0, weight=1)
        ## below weights mean on resize each 1px col1 and row0 grow, col2 and row2 will grow 3px
        # mainframe.columnconfigure(1, weight=1)
        # mainframe.columnconfigure(2, weight=3)
        # mainframe.rowconfigure(0, weight=1)
        # mainframe.rowconfigure(2, weight=3)

        ## 'z-index'-like methods
        # window.attributes("-topmost", 1)
        # window.lift()
        # window.lift(otherwin)
        # window.lower()
        # window.lower(otherwin)
        ### example
        # little = ttk.Label(mainframe, text="Little ")
        # bigger = ttk.Label(mainframe, text='Much bigger label')
        # little.grid(column=0, row=0)
        # bigger.grid(column=0, row=0)
        # mainframe.after(2000, lambda: little.lift())

        ## root.winfo_rgb('red') OR root.winfo_rgb('#3FF') OR root.winfo_rgb('#FF016A') OR root.info_rgb(<between 0 and 65535>)

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
        ### debug button
        # print(' button.configure()', btn.configure(), btn['command'])

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

        ## separator
        # sprtr = ttk.Separator(parent, orient=HORIZONTAL)

        ## labelframe (like fieldset/legend)
        # lf = ttk.Labelframe(parent, text='Label')

        ## panedwindow
        ###  stack two or more resizable widgets above and below each other (or to the left and right).
        # p = ttk.Panedwindow(parent, orient=VERTICAL)
        # # two panes, each of which would get widgets gridded into it:
        # f1 = ttk.Labelframe(p, text='Pane1', width=100, height=100)
        # f2 = ttk.Labelframe(p, text='Pane2', width=100, height=100)
        # p.add(f1)
        # p.add(f2)

        ## notebook (tabbed view)
        ### Notebook widgets generate a <<NotebookTabChanged>> virtual event whenever a new tab is selected.
        # n = ttk.Notebook(parent)
        # f1 = ttk.Frame(n)  # first page, which would get widgets gridded into it
        # f2 = ttk.Frame(n)  # second page
        # n.add(f1, text='One')
        # n.add(f2, text='Two')

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

        # print_hierarchy(root)

        def newFile():
            dirname = filedialog.askdirectory()
            print('newfile',dirname)
        def openFile():
            filename = filedialog.askopenfilename()
            print('openFile',filename)
        def closeFile():
            filename = filedialog.asksaveasfilename()
            print('closeFile',filename)

        def make_menu():
            # print('hi')
            # It's essential to put the following line in your application somewhere before you start creating menus.
            root.option_add('*tearOff', FALSE)
            menubar = Menu(root)
            app_menu = Menu(menubar, name='apple') # adds item to the default "Python" menu
            app_menu.add_command(label='About My Application')
            app_menu.add_separator()
            menu_file = Menu(menubar)
            menu_edit = Menu(menubar)
            menubar.add_cascade(menu=app_menu)
            menubar.add_cascade(menu=menu_file, label='File')
            menubar.add_cascade(menu=menu_edit, label='Edit')
            menu_file.add_command(label='New', command=newFile)
            menu_file.add_command(label='Open...', command=openFile)
            menu_file.add_command(label='Close', command=closeFile)
            menu_file.add_separator()
            menu_recent = Menu(menu_file)
            menu_file.add_cascade(menu=menu_recent, label='Open Recent')
            recent_files = ['a','b',13,42,'scissors']
            for f in recent_files:
                menu_recent.add_command(label=f, command=openFile)
                # menu_recent.add_command(label=os.path.basename(f), command=lambda f=f: openFile(f))
            check = StringVar()
            menu_file.add_checkbutton(label='Check', variable=check, onvalue=1, offvalue=0)
            radio = StringVar()
            menu_file.add_radiobutton(label='One', variable=radio, value=1)
            menu_file.add_radiobutton(label='Two', variable=radio, value=2)
            menu_window = Menu(menubar, name='window') # adds minimize,zoom,etc
            menubar.add_cascade(menu=menu_window, label='Window')
            menu_help = Menu(menubar, name='help') # customized with 'showHelp' below
            menubar.add_cascade(menu=menu_help, label='Help')

            ## menu enhancements
            menu_edit.add_command(label="Paste", command=lambda: root.focus_get().event_generate("<<Paste>>"))
            menu_edit.add_command(label="Find...", command=lambda: root.event_generate("<<OpenFindDialog>>"))
            menu_edit.entryconfigure('Find...', accelerator='Control+3') # <-- shortcut
            menu_recent.delete(4, 'end') # 'scissors' is removed
            # print(menu_file.entrycget(0, 'label'))  # get label of top entry in menu
            # print(menu_file.entryconfigure(0))  # show all options for an item
            menu_file.entryconfigure('Open...', state=DISABLED)
            # menu_bookmarks.entryconfigure(3, label="Hide Bookmarks")
            # menu_edit.add_command(label='Path Browser', underline=5)  # underline "B"

            ###
            ## color chooser
            # from tkinter import colorchooser
            # colorchooser.askcolor(initialcolor='#ff0000')

            ## font chooser
            # l = ttk.Label(root, text="Hello World", font="helvetica 24")
            # l.grid(padx=10, pady=10)
            # def font_changed(font):
            #     l['font'] = font
            # root.tk.call('tk', 'fontchooser', 'configure', '-font', 'helvetica 24', '-command',
            #              root.register(font_changed))
            # root.tk.call('tk', 'fontchooser', 'show')

            ## confirm prompt
            # messagebox.askyesno(
            #     message='Are you sure you want to install SuperVirus?'
            #     icon = 'question' title = 'Install')
            #### other methods (type):
            # ok(default): ⇒ ok                             showinfo: ⇒ "ok"                                        askquestion: ⇒ "yes" or "no"
            # okcancel: ⇒ ok or cancel                      showwarning: ⇒ "ok"                                     askyesnocancel: ⇒ True (on yes), False (on no), or None (on cancel)
            # yesno: ⇒ yes or no                            showerror: ⇒ "ok"
            # yesnocancel: ⇒ yes, no or cancel              askokcancel: ⇒ True (on ok) or False (on cancel)
            # retrycancel: ⇒ retry or cancel                askyesno: ⇒ True (on yes) or False (on no)
            # abortretryignore: ⇒ abort, retry or ignore    askretrycancel: ⇒ True (on retry) or False (on cancel)
            ### full options
            # type: As described above.
            # message: The main message displayed inside the alert.
            # detail: A secondary message (if needed).
            # title: Title for the dialog window. Not used on macOS.
            # icon: Icon, one of info (default), error, question, or warning.
            # default: Default button, e.g., ok or cancel for an okcancel dialog.
            # parent: Window of your application this dialog is being posted for.

            def showSettings():
                messagebox.showinfo(message="Settings would display here")
            root.createcommand('tk::mac::ShowPreferences', showSettings)

            def showHelp():
                messagebox.showinfo(message="Help would display here")
            root.createcommand('tk::mac::ShowHelp', showHelp)

            def launchFindDialog(*args):
                messagebox.showinfo(message="I hope you find what you're looking for!")
            root.bind("<<OpenFindDialog>>", launchFindDialog)

            ### contextual (pop-up) menu
            # for i in ('One', 'Two', 'Three'):
            #     menubar.add_command(label=i)
                # menubar.add_command(label=i, command=lambda e: menubar.post(20, 20))
            # if (root.tk.call('tk', 'windowingsystem') == 'aqua'):
            #     root.bind('<2>', lambda e: menubar.post(e.x_root, e.y_root))
            #     root.bind('<Control-1>', lambda e: menubar.post(e.x_root, e.y_root))
            # else:
            #     root.bind('<3>', lambda e: menubar.post(e.x_root, e.y_root))

            ### Mac Menu Handlers
            # tk::mac::ShowPreferences:
            #   Called when the "Preferences..." menu item is selected.
            # tk::mac::ShowHelp:
            #   Called to display main online help for the application.
            # tk::mac::Quit:
            #   Called when the Quit menu item is selected, when a user is trying to shut down the system etc.
            # tk::mac::OnHide:
            #   Called when your application has been hidden.
            # tk::mac::OnShow:
            #   Called when your application is shown after being hidden.
            # tk::mac::OpenApplication:
            #   Called when your application is first opened.
            # tk::mac::ReopenApplication:
            #   Called when a user "reopens" your already-running application (e.g., clicks on it in the Dock)
            # tk::mac::OpenDocument:
            #   Called when the Finder wants the application to open one or more documents (e.g., that were dropped on it). The procedure is passed a list of pathnames of files to be opened.
            # tk::mac::PrintDocument:
            #   As with OpenDocument, but the documents should be printed rather than opened.

            root['menu'] = menubar # attach menubar to tkinter
        make_menu()

        # for splash screen maybe
        def make_dialog():
            def dismiss():
                dlg.grab_release()
                dlg.destroy()

            dlg = Toplevel(root)
            ttk.Button(dlg, text="Done", command=dismiss).grid()
            dlg.protocol("WM_DELETE_WINDOW", dismiss)  # intercept close button
            dlg.transient(root)  # dialog window is related to main
            dlg.wait_visibility()  # can't grab until window appears, so we wait
            dlg.grab_set()  # ensure all input goes to our window
            dlg.wait_window()  # block until window is destroyed
        # make_dialog()


    def calculate(self, *args):
        try:
            value = float(self.feet.get())
            self.meters.set(int(0.3048 * value * 10000.0 + 0.5) / 10000.0)
        except ValueError:
            pass



root = Tk()
FeetToMeters(root)

## screen information
# print("color depth=" + str(root.winfo_screendepth())+ " (" + root.winfo_screenvisual() + ")")
# print("pixels per inch=" + str(root.winfo_pixels('1i')))
# print("width=", str(root.winfo_screenwidth()) + " height=", str(root.winfo_screenheight()))

root.mainloop()
