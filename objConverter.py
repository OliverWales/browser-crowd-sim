# inputFile = input("Input file: ")
inputFile = "Agent.obj"

vertexPositions = []
normals = []
faces = []

with open(inputFile, "r") as f:
    for line in f.readlines():
        tokens = line.rstrip().split(" ")

        if(tokens[0] == "v"):
            vertexPositions.append([tokens[1], tokens[2], tokens[3]])
        if(tokens[0] == "vn"):
            normals.append([tokens[1], tokens[2], tokens[3]])
        elif(tokens[0] == "f"):
            faces.append([tokens[1], tokens[2], tokens[3]])

vertexNormals = {}
faceVertices = []

for face in faces:
    for faceVertex in face:
        faceVertex = faceVertex.split("//")
        vertexIndex = int(faceVertex[0]) - 1
        normalIndex = int(faceVertex[1]) - 1

        faceVertices.append(vertexIndex)
        vertexNormals[vertexIndex] = normalIndex

print("// prettier-ignore")
print("static vertices = [")
print("  // position           // normal")
for i in range(len(vertexPositions)):
    vertexPosition = vertexPositions[i]
    normalIndex = vertexNormals[i]

    vertexNormal = normals[normalIndex]

    print("  {0}, {1}, {2},\t{3}, {4}, {5},".format(
        float(vertexPosition[0]),
        float(vertexPosition[1]),
        float(vertexPosition[2]),
        float(vertexNormal[0]),
        float(vertexNormal[1]),
        float(vertexNormal[2])))
print("];\n")

print("// prettier-ignore")
print("static indices = [")
for i in range(0, len(faceVertices), 3):
    print("  {0}, {1}, {2},".format(
        faceVertices[i], faceVertices[i + 1], faceVertices[i + 2]))
print("];\n")
