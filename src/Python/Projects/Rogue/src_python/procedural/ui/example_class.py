from tkinter import *
from tkinter import ttk

# py src_python/procedural/ui/example_class.py

class FeetToMeters:

    def __init__(self, root):

        root.title("Feet to Meters")

        mainframe = ttk.Frame(root, padding="3 3 12 12")
        mainframe.grid(column=0, row=0, sticky=(N, W, E, S))
        root.columnconfigure(0, weight=1)
        root.rowconfigure(0, weight=1)

        self.feet = StringVar()
        feet_entry = ttk.Entry(mainframe, width=7, textvariable=self.feet)
        feet_entry.grid(column=2, row=1, sticky=(W,E))
        self.meters = StringVar()

        ttk.Label(mainframe, textvariable=self.meters).grid(column=2, row=2, sticky=(W, E))
        btn = ttk.Button(mainframe, text="Calculate", command=self.calculate)
        btn.grid(column=3, row=3, sticky=W)

        ttk.Label(mainframe, text="feet").grid(column=3, row=1, sticky=W)
        ttk.Label(mainframe, text="is equivalent to").grid(column=1, row=2, sticky=E)
        ttk.Label(mainframe, text="meters").grid(column=3, row=2, sticky=W)

        # print('mainframe.winfo_children()',mainframe.winfo_children())
        for child in mainframe.winfo_children():
            child.grid_configure(padx=5, pady=5)
            # print('str(widget)', str(child))

        feet_entry.focus()
        root.bind("<Return>", self.calculate)

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
