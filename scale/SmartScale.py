#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Sat Dec  7 20:11:29 2019

@author: khalid
"""

from bs4 import BeautifulSoup
import requests
import time
import sys
import tkinter as tk
from tkinter import messagebox
import urllib.request



#get file, https://stackoverflow.com/questions/11023530/python-to-list-http-files-and-directories

url = 'http://localhost:8080' #https://www.npmjs.com/package/http-server
ext = 'txt'

filename = []
#get file name from the http-server server
def listFD(url, ext=''):
    page = requests.get(url).text
    soup = BeautifulSoup(page, 'html.parser')
    return [node.get('href') for node in soup.find_all('a') if node.get('href').endswith(ext)]

for file in listFD(url, ext):
    filename.append(file[1:-4])


#edited from example.py
def scale(weights):
    EMULATE_HX711=False
    referenceUnit = 1

    if not EMULATE_HX711:
        import RPi.GPIO as GPIO
        from hx711 import HX711
    else:
        from emulated_hx711 import HX711

    def cleanAndExit():
        print("Cleaning...")

        if not EMULATE_HX711:
            GPIO.cleanup()

        #print("Bye!")
        sys.exit()

    hx = HX711(5, 6)

# I've found out that, for some reason, the order of the bytes is not always the same between versions of python, numpy and the hx711 itself.
# Still need to figure out why does it change.
# If you're experiencing super random values, change these values to MSB or LSB until to get more stable values.
# There is some code below to debug and log the order of the bits and the bytes.
# The first parameter is the order in which the bytes are used to build the "long" value.
# The second paramter is the order of the bits inside each byte.
# According to the HX711 Datasheet, the second parameter is MSB so you shouldn't need to modify it.
    hx.set_reading_format("MSB", "MSB")

# HOW TO CALCULATE THE REFFERENCE UNIT
# To set the reference unit to 1. Put 1kg on your sensor or anything you have and know exactly how much it weights.
# In this case, 92 is 1 gram because, with 1 as a reference unit I got numbers near 0 without any weight
# and I got numbers around 184000 when I added 2kg. So, according to the rule of thirds:
# If 2000 grams is 184000 then 1000 grams is 184000 / 2000 = 92.
    hx.set_reference_unit(100)
    hx.set_reference_unit(referenceUnit)

    hx.reset()

    hx.tare()

    #print("Tare done! Add weight now...")

# to use both channels, you'll need to tare them both
#hx.tare_A()
#hx.tare_B()
    switch = False
    initialization = False
    init = 0
    index = 0
    timer = 0
    scaledWeight = []
    for i in weights:
        scaledWeight.append((i*300)) # changing grams to the scale units

    while True:
        try:
        # These three lines are usefull to debug wether to use MSB or LSB in the reading formats
        # for the first parameter of "hx.set_reading_format("LSB", "MSB")".
        # Comment the two lines "val = hx.get_weight(5)" and "print val" and uncomment these three lines to see what it prints.

        # np_arr8_string = hx.get_np_arr8_string()
        # binary_string = hx.get_binary_string()
        # print binary_string + " " + np_arr8_string

        # Prints the weight. Comment if you're debbuging the MSB and LSB issue.
            val = hx.get_weight(5)
            timer += 1
           # print(val)
            
            # initialization the weight
            if(initialization == False and timer == 10):
                init = val
                initialization = True
            
            if(timer == 10):
                messagebox.showinfo("message","you can add the ingredient")
                r.update()


            if(index == len(scaledWeight)):
                messagebox.showinfo("message","done")
                break
            #Ingredient is added on the scale
            if(val - init >= scaledWeight[index] and timer > 10):
                switch = True
                index += 1
                timer = 0
                #print("phase",index)
                messagebox.showinfo("message","ingredient "+str(index)+" complete")
                r.update()

            #get the new value of the weight after adding an ingredient
            if(switch and timer == 10):
                init = val
                switch = False


        # To get weight from both channels (if you have load cells hooked up
        # to both channel A and B), do something like this
        #val_A = hx.get_weight_A(5)
        #val_B = hx.get_weight_B(5)
        #print "A: %s  B: %s" % ( val_A, val_B )

            hx.power_down()
            hx.power_up()
            time.sleep(0.1)

        except (KeyboardInterrupt, SystemExit):
            cleanAndExit()

#ingredients = []
weights = []

#choose a recipe to make
def run_recipe(recipeName):
    #print(recipeName)
    recipe = urllib.request.urlopen("http://10.201.57.167:8080/"+recipeName+".txt")
    #get the weights of the ingredients and put them in an array to use for the scale
    for line in recipe:
        recipeFile = str(line)
        recipeFile = recipeFile[2:-1]
        recipeWeights = recipeFile.split(',')
        weights = list(map(int, recipeWeights))
        print(weights)
        scale(weights)


#make a list of all the recipes
def recipeList():
    listbox = tk.Listbox(r)
    for i in enumerate(filename):
        listbox.insert( i[0], i[1] )
    listbox.pack()

#GUI
r = tk.Tk()
r.title('Smart Bake')
r.resizable(True, True)
r.geometry('500x250')

input_text = tk.StringVar()
entry1 = tk.Entry(r, textvariable = input_text).pack()
button = tk.Button(r, text='Submit', width=25, command=lambda: run_recipe(input_text.get())).pack()
recipeList()
r.mainloop()

