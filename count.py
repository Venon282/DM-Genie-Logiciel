# -*- coding: utf-8 -*-
"""
Created on Fri Mar 10 16:13:25 2023

@author: esto5
"""

import os

def current_files():
    file_list = os.listdir(os.getcwd())
    for file_name in file_list:
        print(file_name)

def count_files(path, exclude=[], ext_exclude=['.png','.png','.csv','.p12','.pdf','.ico','.gif']):
    total = 0
    dico={}
    if os.path.isdir(path):
        for entry in os.listdir(path):
            if entry not in exclude:
                entry_path = os.path.join(path, entry)
                t, d = count_files(entry_path, exclude,ext_exclude)
                total+=t
                dico = {key: dico.get(key, 0) + d.get(key, 0) for key in set(dico) | set(d)}
    elif os.path.isfile(path):  
        if os.path.basename(path) not in exclude and not path.split("/")[-1].startswith("."):
            _, ext = os.path.splitext(path)
            if ext not in ext_exclude:
                if ext not in dico:
                    dico[ext]=1
                else :
                    dico[ext]+=1
                with open(path, 'r', encoding="UTF-8") as file:
                    total +=len(file.read().split('\n'))
    return total, dico

ext_exclude=['.png','.png','.csv','.xml','.p12','.pdf','.ico','.gif']
exclusions = ["images"]
res, dico = count_files('D:\\Folders\\Ecole\\Génie logiciek\\Jhipster\\DM-Genie-Logiciel\\src\\',exclusions,ext_exclude)
print(dico)
print("Total = " + str(res))

