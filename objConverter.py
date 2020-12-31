inputFile = input("Input file: ")

verts = []
faces = []

with open(inputFile, "r") as f:
    for line in f.readlines():
        tokens = line.rstrip().split(" ")

        if(tokens[0] == "v"):
            verts.append([tokens[1], tokens[2], tokens[3]])
        elif(tokens[0] == "f"):
            faces.append([tokens[1], tokens[2], tokens[3]])

print("// prettier-ignore")
print("static vertices = [")
for vert in verts:
    print("  {0}, {1}, {2},".format(
        float(vert[0]), float(vert[1]), float(vert[2])))
print("];\n")

print("// prettier-ignore")
print("static indices = [")
for face in faces:
    print("  {0}, {1}, {2},".format(
        int(face[0])-1, int(face[1])-1, int(face[2])-1))
print("];\n")
