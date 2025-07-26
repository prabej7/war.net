type Coordinate = {
  latitude: number;
  longitude: number;
};

type Region = Coordinate & {
  latitudeDelta: number;
  longitudeDelta: number;
};

type Quick = "low" | "moderate" | "high";
type Severity = "critical" | "high" | "moderate" | "low";
type Member = {
  id: string;
  status: "Present" | "Missing";
  location?: string;
};

type User = {
  id: string;
  userId: string;
  status: "PRESENT" | "MISSING";
  createdAt: string;
  updatedAt: string;
  location?: DBCoord;
  shelter?: string;
  parentId?: string;
  parent?: User;
  children?: User[];
  coordinatesId?: string;
};

type DBCoord = {
  id: string;
  latitude: number;
  longitude: number;
  createdAt: Date;
  updatedAt: Date;
};

export { Coordinate, Region, Quick, Member, Severity, User };
