drop table DELIVERYSTAFF cascade constraints;
drop table EMPLOYEE cascade constraints;
drop table INVENTORY cascade constraints;
drop table INVENTORYMANAGER cascade constraints;
drop table ORDERLINE cascade constraints;
drop table PAYMENT cascade constraints;
drop table PRODUCT cascade constraints;
drop table RESTOCKORDER cascade constraints;
drop table SHIPMENT cascade constraints;
drop table SUPPLIER cascade constraints;
drop table SUPPLIERCITY cascade constraints;
drop table SUPPLIERPROVINCE cascade constraints;
drop table WAREHOUSE cascade constraints;
drop table WAREHOUSECITY cascade constraints;
drop table WAREHOUSEMANAGER cascade constraints;
drop table WAREHOUSEPROVINCE cascade constraints;
-- TODO: Ask TA if decomposition is correct
CREATE TABLE WarehouseCity
(
    PostalCode CHAR(6) PRIMARY KEY,
    City       VARCHAR2(255)
);

CREATE TABLE WarehouseProvince
(
    PostalCode CHAR(6) PRIMARY KEY,
    Province   VARCHAR2(255),
    FOREIGN KEY (PostalCode) REFERENCES WarehouseCity (PostalCode)
);

CREATE TABLE Warehouse
(
    WID        CHAR(10) PRIMARY KEY,
    Capacity   INT,
    Address    VARCHAR2(255),
    PostalCode CHAR(6),
    FOREIGN KEY (PostalCode) REFERENCES WarehouseProvince (PostalCode)
);

CREATE TABLE Employee
(
    EID    CHAR(10) PRIMARY KEY,
    Name   VARCHAR2(255) NOT NULL,
    Salary NUMBER(10, 2),
    WID    CHAR(10)      NOT NULL,
    FOREIGN KEY (WID) REFERENCES Warehouse (WID) ON DELETE CASCADE
);

CREATE TABLE WarehouseManager
(
    EID      CHAR(10) PRIMARY KEY,
    TeamSize INT,
    FOREIGN KEY (EID) REFERENCES Employee (EID) ON DELETE CASCADE
);

CREATE TABLE DeliveryStaff
(
    EID             CHAR(10) PRIMARY KEY,
    DeliveryVehicle VARCHAR2(255),
    FOREIGN KEY (EID) REFERENCES Employee (EID) ON DELETE CASCADE
);

CREATE TABLE InventoryManager
(
    EID            CHAR(10) PRIMARY KEY,
    Specialization VARCHAR2(255),
    FOREIGN KEY (EID) REFERENCES Employee (EID) ON DELETE CASCADE
);


CREATE TABLE SupplierCity
(
    PostalCode CHAR(6) PRIMARY KEY,
    City       VARCHAR2(255)
);

CREATE TABLE SupplierProvince
(
    PostalCode CHAR(6) PRIMARY KEY,
    Province   VARCHAR2(255),
    FOREIGN KEY (PostalCode) REFERENCES SupplierCity (PostalCode)
);

CREATE TABLE Supplier
(
    SID        CHAR(10) PRIMARY KEY,
    Address    VARCHAR2(255),
    PostalCode CHAR(6),
    FOREIGN KEY (PostalCode) REFERENCES SupplierProvince (PostalCode)
);

CREATE TABLE Product
(
    PID                  CHAR(10) PRIMARY KEY,
    Name                 VARCHAR2(255),
    Description          VARCHAR2(255),
    UnitPrice            NUMBER(10, 2),
    MinimumOrder         INT,
    SID                  CHAR(10),
    FOREIGN KEY (SID) REFERENCES Supplier (SID) ON DELETE CASCADE
);

CREATE TABLE Inventory
(
    IID               CHAR(10) PRIMARY KEY,
    QuantityAvailable INT      NOT NULL,
    ReorderLevel      INT      NOT NULL,
    WID               CHAR(10) NOT NULL,
    PID               CHAR(10) NOT NULL,
    UNIQUE (PID),
    FOREIGN KEY (WID) REFERENCES Warehouse (WID) ON DELETE CASCADE,
    FOREIGN KEY (PID) REFERENCES Product (PID) ON DELETE CASCADE
);

CREATE TABLE RestockOrder(
    ROID      CHAR(10) PRIMARY KEY,
    Status    VARCHAR2(20) CHECK (Status IN ('Pending', 'Confirmed', 'Processing', 'Completed', 'Returned')) NOT NULL,
    OrderDate DATE,
    TotalCost NUMBER(10, 2),
    SID       CHAR(10)                                                                                       NOT NULL,
    WID       CHAR(10)                                                                                       NOT NULL,
    FOREIGN KEY (SID) REFERENCES Supplier (SID) ON DELETE CASCADE,
    FOREIGN KEY (WID) REFERENCES Warehouse (WID) ON DELETE CASCADE
);

CREATE TABLE Shipment
(
    ShipID               CHAR(10) PRIMARY KEY,
    Status               VARCHAR2(20) CHECK (Status IN ('Shipped', 'In Transit', 'Delayed', 'Delivered')) NOT NULL,
    ShipmentDate         DATE,
    ExpectedDeliveryDate DATE,
    ROID                 CHAR(10)                                                                         NOT NULL UNIQUE,
    FOREIGN KEY (ROID) REFERENCES RestockOrder (ROID) ON DELETE CASCADE
);

CREATE TABLE Payment
(
    PayID         CHAR(10) PRIMARY KEY,
    Status        VARCHAR2(20) CHECK (Status IN ('Pending', 'Processing', 'Completed', 'Failed', 'Cancelled',
                                                 'Refunded')) NOT NULL,
    PaymentDate   DATE,
    PaymentMethod VARCHAR2(50),
    AmountPaid    NUMBER(10, 2),
    ROID          CHAR(10)                                    NOT NULL UNIQUE,
    FOREIGN KEY (ROID) REFERENCES RestockOrder (ROID) ON DELETE CASCADE
);

CREATE TABLE OrderLine
(
    OID           CHAR(10),
    QuantityOrder INT      NOT NULL,
    PID           CHAR(10) NOT NULL,
    ROID          CHAR(10),
    PRIMARY KEY (ROID, OID),
    FOREIGN KEY (ROID) REFERENCES RestockOrder (ROID) ON DELETE CASCADE,
    FOREIGN KEY (PID) REFERENCES Product (PID) ON DELETE CASCADE
);


INSERT INTO WarehouseCity (PostalCode, City) VALUES ('A1B2C3', 'Toronto');
INSERT INTO WarehouseCity (PostalCode, City) VALUES ('B1C2D3', 'Montreal');
INSERT INTO WarehouseCity (PostalCode, City) VALUES ('C1D2E3', 'Vancouver');
INSERT INTO WarehouseCity (PostalCode, City) VALUES ('D1E2F3', 'Calgary');
INSERT INTO WarehouseCity (PostalCode, City) VALUES ('E1F2G3', 'Ottawa');
INSERT INTO WarehouseCity (PostalCode, City) VALUES ('F1G2H3', 'Edmonton');
INSERT INTO WarehouseCity (PostalCode, City) VALUES ('G1H2I3', 'Quebec City');
INSERT INTO WarehouseCity (PostalCode, City) VALUES ('H1I2J3', 'Winnipeg');
INSERT INTO WarehouseCity (PostalCode, City) VALUES ('I1J2K3', 'Halifax');
INSERT INTO WarehouseCity (PostalCode, City) VALUES ('J1K2L3', 'Victoria');


INSERT INTO WarehouseProvince (PostalCode, Province) VALUES ('A1B2C3', 'Ontario');
INSERT INTO WarehouseProvince (PostalCode, Province) VALUES ('B1C2D3', 'Quebec');
INSERT INTO WarehouseProvince (PostalCode, Province) VALUES ('C1D2E3', 'British Columbia');
INSERT INTO WarehouseProvince (PostalCode, Province) VALUES ('D1E2F3', 'Alberta');
INSERT INTO WarehouseProvince (PostalCode, Province) VALUES ('E1F2G3', 'Ontario');
INSERT INTO WarehouseProvince (PostalCode, Province) VALUES ('F1G2H3', 'Alberta');
INSERT INTO WarehouseProvince (PostalCode, Province) VALUES ('G1H2I3', 'Quebec');
INSERT INTO WarehouseProvince (PostalCode, Province) VALUES ('H1I2J3', 'Manitoba');
INSERT INTO WarehouseProvince (PostalCode, Province) VALUES ('I1J2K3', 'Nova Scotia');
INSERT INTO WarehouseProvince (PostalCode, Province) VALUES ('J1K2L3', 'British Columbia');


INSERT INTO Warehouse (WID, Capacity, Address, PostalCode) VALUES ('0000000001', 5000, '1234 Warehouse Lane', 'A1B2C3');
INSERT INTO Warehouse (WID, Capacity, Address, PostalCode) VALUES ('0000000002', 3000, '5678 Storage Blvd', 'B1C2D3');
INSERT INTO Warehouse (WID, Capacity, Address, PostalCode) VALUES ('0000000003', 4000, '9101 Depot St', 'C1D2E3');
INSERT INTO Warehouse (WID, Capacity, Address, PostalCode) VALUES ('0000000004', 3500, '2345 Distribution Dr', 'D1E2F3');
INSERT INTO Warehouse (WID, Capacity, Address, PostalCode) VALUES ('0000000005', 2500, '6789 Fulfillment Rd', 'E1F2G3');
INSERT INTO Warehouse (WID, Capacity, Address, PostalCode) VALUES ('0000000006', 6000, '1357 Logistics Ave', 'F1G2H3');
INSERT INTO Warehouse (WID, Capacity, Address, PostalCode) VALUES ('0000000007', 2000, '2468 Warehouse Pl', 'G1H2I3');
INSERT INTO Warehouse (WID, Capacity, Address, PostalCode) VALUES ('0000000008', 4500, '3690 Stock Ln', 'H1I2J3');
INSERT INTO Warehouse (WID, Capacity, Address, PostalCode) VALUES ('0000000009', 3200, '1470 Parcel Blvd', 'I1J2K3');
INSERT INTO Warehouse (WID, Capacity, Address, PostalCode) VALUES ('0000000010', 3800, '8520 Packing Dr', 'J1K2L3');


INSERT INTO Employee (EID, Name, Salary, WID) VALUES ('0000000001', 'John Doe', 60000.00, '0000000001');
INSERT INTO Employee (EID, Name, Salary, WID) VALUES ('0000000002', 'Jane Smith', 55000.00, '0000000002');
INSERT INTO Employee (EID, Name, Salary, WID) VALUES ('0000000003', 'Alice Brown', 62000.00, '0000000003');
INSERT INTO Employee (EID, Name, Salary, WID) VALUES ('0000000004', 'Bob Johnson', 58000.00, '0000000004');
INSERT INTO Employee (EID, Name, Salary, WID) VALUES ('0000000005', 'Charlie Green', 54000.00, '0000000005');
INSERT INTO Employee (EID, Name, Salary, WID) VALUES ('0000000006', 'Diana King', 50000.00, '0000000006');
INSERT INTO Employee (EID, Name, Salary, WID) VALUES ('0000000007', 'Eve Adams', 49000.00, '0000000007');
INSERT INTO Employee (EID, Name, Salary, WID) VALUES ('0000000008', 'Frank White', 52000.00, '0000000008');
INSERT INTO Employee (EID, Name, Salary, WID) VALUES ('0000000009', 'Grace Hall', 51000.00, '0000000009');
INSERT INTO Employee (EID, Name, Salary, WID) VALUES ('0000000010', 'Henry Lee', 53000.00, '0000000010');
INSERT INTO Employee (EID, Name, Salary, WID) VALUES ('0000000011', 'Ivy Moore', 56000.00, '0000000001');
INSERT INTO Employee (EID, Name, Salary, WID) VALUES ('0000000012', 'Jack Wilson', 57000.00, '0000000002');
INSERT INTO Employee (EID, Name, Salary, WID) VALUES ('0000000013', 'Lily Evans', 58000.00, '0000000003');
INSERT INTO Employee (EID, Name, Salary, WID) VALUES ('0000000014', 'Mike Taylor', 59000.00, '0000000004');
INSERT INTO Employee (EID, Name, Salary, WID) VALUES ('0000000015', 'Nina Lewis', 60000.00, '0000000005');


INSERT INTO WarehouseManager (EID, TeamSize) VALUES ('0000000001', 10);
INSERT INTO WarehouseManager (EID, TeamSize) VALUES ('0000000002', 8);
INSERT INTO WarehouseManager (EID, TeamSize) VALUES ('0000000003', 12);
INSERT INTO WarehouseManager (EID, TeamSize) VALUES ('0000000004', 7);
INSERT INTO WarehouseManager (EID, TeamSize) VALUES ('0000000005', 9);

INSERT INTO DeliveryStaff (EID, DeliveryVehicle) VALUES ('0000000006', 'Truck A123');
INSERT INTO DeliveryStaff (EID, DeliveryVehicle) VALUES('0000000007', 'Van B456');
INSERT INTO DeliveryStaff (EID, DeliveryVehicle) VALUES('0000000008', 'Truck C789');
INSERT INTO DeliveryStaff (EID, DeliveryVehicle) VALUES('0000000009', 'Van D012');
INSERT INTO DeliveryStaff (EID, DeliveryVehicle) VALUES('0000000010', 'Truck E345');

INSERT INTO InventoryManager (EID, Specialization) VALUES ('0000000011', 'Electronics');
INSERT INTO InventoryManager (EID, Specialization) VALUES('0000000012', 'Fragile Goods');
INSERT INTO InventoryManager (EID, Specialization) VALUES('0000000013', 'Perishables');
INSERT INTO InventoryManager (EID, Specialization) VALUES('0000000014', 'Heavy Equipment');
INSERT INTO InventoryManager (EID, Specialization) VALUES('0000000015', 'Furniture');


INSERT INTO SupplierCity (PostalCode, City) VALUES ('K1L2M3', 'New York');
INSERT INTO SupplierCity (PostalCode, City) VALUES ('L1M2N3', 'Chicago');
INSERT INTO SupplierCity (PostalCode, City) VALUES ('M1N2O3', 'Los Angeles');
INSERT INTO SupplierCity (PostalCode, City) VALUES ('N1O2P3', 'San Francisco');
INSERT INTO SupplierCity (PostalCode, City) VALUES ('O1P2Q3', 'Houston');
INSERT INTO SupplierCity (PostalCode, City) VALUES ('P1Q2R3', 'Miami');
INSERT INTO SupplierCity (PostalCode, City) VALUES ('Q1R2S3', 'Boston');
INSERT INTO SupplierCity (PostalCode, City) VALUES ('R1S2T3', 'Phoenix');
INSERT INTO SupplierCity (PostalCode, City) VALUES ('S1T2U3', 'Seattle');
INSERT INTO SupplierCity (PostalCode, City) VALUES ('T1U2V3', 'Denver');
INSERT INTO SupplierCity (PostalCode, City) VALUES ('S1A2A3', 'Seattle');
INSERT INTO SupplierCity (PostalCode, City) VALUES ('K1B1M1', 'New York');
INSERT INTO SupplierCity (PostalCode, City) VALUES ('K1A1B1', 'New York');

INSERT INTO SupplierProvince (PostalCode, Province) VALUES ('K1L2M3', 'New York');
INSERT INTO SupplierProvince (PostalCode, Province) VALUES ('L1M2N3', 'Illinois');
INSERT INTO SupplierProvince (PostalCode, Province) VALUES ('M1N2O3', 'California');
INSERT INTO SupplierProvince (PostalCode, Province) VALUES ('N1O2P3', 'California');
INSERT INTO SupplierProvince (PostalCode, Province) VALUES ('O1P2Q3', 'Texas');
INSERT INTO SupplierProvince (PostalCode, Province) VALUES ('P1Q2R3', 'Florida');
INSERT INTO SupplierProvince (PostalCode, Province) VALUES ('Q1R2S3', 'Massachusetts');
INSERT INTO SupplierProvince (PostalCode, Province) VALUES ('R1S2T3', 'Arizona');
INSERT INTO SupplierProvince (PostalCode, Province) VALUES ('S1T2U3', 'Washington');
INSERT INTO SupplierProvince (PostalCode, Province) VALUES ('T1U2V3', 'Colorado');
INSERT INTO SupplierProvince (PostalCode, Province) VALUES ('K1B1M1', 'New York');
INSERT INTO SupplierProvince (PostalCode, Province) VALUES ('S1A2A3', 'Washington');
INSERT INTO SupplierProvince (PostalCode, Province) VALUES ('K1A1B1', 'New York');


INSERT INTO Supplier (SID, Address, PostalCode) VALUES ('0000000001', '123 Supply Rd', 'K1L2M3');
INSERT INTO Supplier (SID, Address, PostalCode) VALUES ('0000000002', '456 Vendor St', 'L1M2N3');
INSERT INTO Supplier (SID, Address, PostalCode) VALUES ('0000000003', '789 Wholesale Ave', 'M1N2O3');
INSERT INTO Supplier (SID, Address, PostalCode) VALUES ('0000000004', '101 Distributor Blvd', 'N1O2P3');
INSERT INTO Supplier (SID, Address, PostalCode) VALUES ('0000000005', '112 Supplier Ln', 'O1P2Q3');
INSERT INTO Supplier (SID, Address, PostalCode) VALUES ('0000000006', '134 Supply Dr', 'P1Q2R3');
INSERT INTO Supplier (SID, Address, PostalCode) VALUES ('0000000007', '156 Vendor Blvd', 'Q1R2S3');
INSERT INTO Supplier (SID, Address, PostalCode) VALUES ('0000000008', '178 Distributor St', 'R1S2T3');
INSERT INTO Supplier (SID, Address, PostalCode) VALUES ('0000000009', '190 Supply Pl', 'S1T2U3');
INSERT INTO Supplier (SID, Address, PostalCode) VALUES ('0000000010', '212 Vendor Blvd', 'T1U2V3');
INSERT INTO Supplier (SID, Address, PostalCode) VALUES ('0000000011', '122 Vendor Blvd', 'K1B1M1');
INSERT INTO Supplier (SID, Address, PostalCode) VALUES ('0000000012', '111 China Blvd', 'S1A2A3');
INSERT INTO Supplier (SID, Address, PostalCode) VALUES ('0000000013', '200 Main St', 'K1A1B1');


INSERT INTO Product (PID, Description, Name, UnitPrice, MinimumOrder, SID) VALUES ('0000000001', 'Electronic Resistor', 'Resistor', 0.10, 100, '0000000001');
INSERT INTO Product (PID, Description, Name, UnitPrice, MinimumOrder, SID) VALUES ('0000000017', 'Baseball Cap Blue Unisex', 'Baseball Cap', 0.50, 1000,'0000000011');
INSERT INTO Product (PID, Description, Name, UnitPrice, MinimumOrder, SID) VALUES ('0000000002', 'Ceramic Capacitor', 'Capacitor', 0.15, 200, '0000000002');
INSERT INTO Product (PID, Description, Name, UnitPrice, MinimumOrder, SID) VALUES ('0000000003', 'LED Light', 'LED', 0.50, 150, '0000000003');
INSERT INTO Product (PID, Description, Name, UnitPrice, MinimumOrder, SID) VALUES ('0000000014', 'Laptops', 'Macbook', 1000.00, 2,'0000000003');
INSERT INTO Product (PID, Description, Name, UnitPrice, MinimumOrder, SID) VALUES ('0000000015', 'Headphones', 'Airpods', 200.00, 100,'0000000003');
INSERT INTO Product (PID, Description, Name, UnitPrice, MinimumOrder, SID) VALUES ('0000000016', 'Glasses', 'Vision Pro', 750, 120,'0000000003');
INSERT INTO Product (PID, Description, Name, UnitPrice, MinimumOrder, SID) VALUES ('0000000004', 'Power Transistor', 'Transistor', 1.00, 75, '0000000004');
INSERT INTO Product (PID, Description, Name, UnitPrice, MinimumOrder, SID) VALUES ('0000000005', 'Arduino Board', 'Arduino', 25.00, 10, '0000000005');
INSERT INTO Product (PID, Description, Name, UnitPrice, MinimumOrder, SID) VALUES ('0000000006', 'Microcontroller Unit', 'MCU', 5.00, 50, '0000000006');
INSERT INTO Product (PID, Description, Name, UnitPrice, MinimumOrder, SID) VALUES ('0000000007', 'Lithium Battery', 'Battery', 2.50, 30, '0000000007');
INSERT INTO Product (PID, Description, Name, UnitPrice, MinimumOrder, SID) VALUES ('0000000008', 'Solar Panel', 'Solar Panel', 20.00, 20, '0000000008');
INSERT INTO Product (PID, Description, Name, UnitPrice, MinimumOrder, SID) VALUES ('0000000009', 'Voltage Regulator', 'Regulator', 1.50, 40, '0000000009');
INSERT INTO Product (PID, Description, Name, UnitPrice, MinimumOrder, SID) VALUES ('0000000010', 'Breadboard', 'Breadboard', 0.75, 60, '0000000010');
INSERT INTO Product (PID, Description, Name, UnitPrice, MinimumOrder, SID) VALUES ('0000000011', 'Yellow Fruit', 'Banana', 1.75, 10,'0000000010');
INSERT INTO Product (PID, Description, Name, UnitPrice, MinimumOrder, SID) VALUES ('0000000012', 'Yellow Sour Fruit', 'Pineapple', 5.50, 40,'0000000010');
INSERT INTO Product (PID, Description, Name, UnitPrice, MinimumOrder, SID) VALUES ('0000000013', 'Red Fruit', 'Apple', 3.00, 30,'0000000009');


INSERT INTO Inventory (IID, QuantityAvailable, ReorderLevel, WID, PID) VALUES ('0000000001', 500, 100, '0000000001', '0000000001');
INSERT INTO Inventory (IID, QuantityAvailable, ReorderLevel, WID, PID) VALUES ('0000000002', 300, 50, '0000000001', '0000000002');
INSERT INTO Inventory (IID, QuantityAvailable, ReorderLevel, WID, PID) VALUES ('0000000003', 250, 75, '0000000001', '0000000003');
INSERT INTO Inventory (IID, QuantityAvailable, ReorderLevel, WID, PID) VALUES ('0000000004', 150, 25, '0000000001', '0000000004');
INSERT INTO Inventory (IID, QuantityAvailable, ReorderLevel, WID, PID) VALUES ('0000000005', 100, 10, '0000000001', '0000000005');
INSERT INTO Inventory (IID, QuantityAvailable, ReorderLevel, WID, PID) VALUES ('0000000006', 400, 50, '0000000001', '0000000006');
INSERT INTO Inventory (IID, QuantityAvailable, ReorderLevel, WID, PID) VALUES ('0000000007', 350, 30, '0000000001', '0000000007');
INSERT INTO Inventory (IID, QuantityAvailable, ReorderLevel, WID, PID) VALUES ('0000000008', 200, 20, '0000000001', '0000000008');
INSERT INTO Inventory (IID, QuantityAvailable, ReorderLevel, WID, PID) VALUES ('0000000009', 450, 40, '0000000001', '0000000009');
INSERT INTO Inventory (IID, QuantityAvailable, ReorderLevel, WID, PID) VALUES ('0000000010', 375, 60, '0000000001', '0000000010');
INSERT INTO Inventory (IID, QuantityAvailable, ReorderLevel, WID, PID) VALUES ('0000000011', 375, 60, '0000000001', '0000000011');
INSERT INTO Inventory (IID, QuantityAvailable, ReorderLevel, WID, PID) VALUES ('0000000012', 375, 60, '0000000001', '0000000012');
INSERT INTO Inventory (IID, QuantityAvailable, ReorderLevel, WID, PID) VALUES ('0000000013', 375, 60, '0000000001', '0000000013');
INSERT INTO Inventory (IID, QuantityAvailable, ReorderLevel, WID, PID) VALUES ('0000000014', 375, 60, '0000000001', '0000000014');
INSERT INTO Inventory (IID, QuantityAvailable, ReorderLevel, WID, PID) VALUES ('0000000015', 375, 60, '0000000001', '0000000015');
INSERT INTO Inventory (IID, QuantityAvailable, ReorderLevel, WID, PID) VALUES ('0000000016', 375, 60, '0000000001', '0000000016');
INSERT INTO Inventory (IID, QuantityAvailable, ReorderLevel, WID, PID) VALUES ('0000000017', 375, 60, '0000000001', '0000000017');


INSERT INTO RestockOrder (ROID, Status, OrderDate, TotalCost, SID, WID) VALUES ('0000000001', 'Pending', TO_DATE('2024-01-01', 'YYYY-MM-DD'), 500.00, '0000000001', '0000000001');
INSERT INTO RestockOrder (ROID, Status, OrderDate, TotalCost, SID, WID) VALUES ('0000000002', 'Confirmed', TO_DATE('2024-01-05', 'YYYY-MM-DD'), 1500.00, '0000000002', '0000000002');
INSERT INTO RestockOrder (ROID, Status, OrderDate, TotalCost, SID, WID) VALUES ('0000000003', 'Processing', TO_DATE('2024-01-10', 'YYYY-MM-DD'), 750.00, '0000000003', '0000000003');
INSERT INTO RestockOrder (ROID, Status, OrderDate, TotalCost, SID, WID) VALUES ('0000000004', 'Completed', TO_DATE('2024-01-15', 'YYYY-MM-DD'), 3000.00, '0000000004', '0000000004');
INSERT INTO RestockOrder (ROID, Status, OrderDate, TotalCost, SID, WID) VALUES ('0000000005', 'Returned', TO_DATE('2024-01-20', 'YYYY-MM-DD'), 2000.00, '0000000005', '0000000005');
INSERT INTO RestockOrder (ROID, Status, OrderDate, TotalCost, SID, WID) VALUES ('0000000006', 'Pending', TO_DATE('2024-01-25', 'YYYY-MM-DD'), 1250.00, '0000000006', '0000000006');
INSERT INTO RestockOrder (ROID, Status, OrderDate, TotalCost, SID, WID) VALUES ('0000000007', 'Confirmed', TO_DATE('2024-01-30', 'YYYY-MM-DD'), 1750.00, '0000000007', '0000000007');
INSERT INTO RestockOrder (ROID, Status, OrderDate, TotalCost, SID, WID) VALUES ('0000000008', 'Processing', TO_DATE('2024-02-01', 'YYYY-MM-DD'), 1100.00, '0000000008', '0000000008');
INSERT INTO RestockOrder (ROID, Status, OrderDate, TotalCost, SID, WID) VALUES ('0000000009', 'Completed', TO_DATE('2024-02-05', 'YYYY-MM-DD'), 950.00, '0000000009', '0000000009');
INSERT INTO RestockOrder (ROID, Status, OrderDate, TotalCost, SID, WID) VALUES ('0000000010', 'Returned', TO_DATE('2024-02-10', 'YYYY-MM-DD'), 1400.00, '0000000010', '0000000010');

INSERT INTO Shipment (ShipID, Status, ShipmentDate, ExpectedDeliveryDate, ROID) VALUES ('0000000001', 'Shipped', TO_DATE('2024-01-02', 'YYYY-MM-DD'), TO_DATE('2024-01-06', 'YYYY-MM-DD'), '0000000001');
INSERT INTO Shipment (ShipID, Status, ShipmentDate, ExpectedDeliveryDate, ROID) VALUES ('0000000002', 'In Transit', TO_DATE('2024-01-06', 'YYYY-MM-DD'), TO_DATE('2024-01-10', 'YYYY-MM-DD'), '0000000002');
INSERT INTO Shipment (ShipID, Status, ShipmentDate, ExpectedDeliveryDate, ROID) VALUES ('0000000003', 'Delayed', TO_DATE('2024-01-11', 'YYYY-MM-DD'), TO_DATE('2024-01-15', 'YYYY-MM-DD'), '0000000003');
INSERT INTO Shipment (ShipID, Status, ShipmentDate, ExpectedDeliveryDate, ROID) VALUES ('0000000004', 'Delivered', TO_DATE('2024-01-16', 'YYYY-MM-DD'), TO_DATE('2024-01-20', 'YYYY-MM-DD'), '0000000004');
INSERT INTO Shipment (ShipID, Status, ShipmentDate, ExpectedDeliveryDate, ROID) VALUES ('0000000005', 'Shipped', TO_DATE('2024-01-21', 'YYYY-MM-DD'), TO_DATE('2024-01-25', 'YYYY-MM-DD'), '0000000005');
INSERT INTO Shipment (ShipID, Status, ShipmentDate, ExpectedDeliveryDate, ROID) VALUES ('0000000006', 'In Transit', TO_DATE('2024-01-26', 'YYYY-MM-DD'), TO_DATE('2024-01-30', 'YYYY-MM-DD'), '0000000006');
INSERT INTO Shipment (ShipID, Status, ShipmentDate, ExpectedDeliveryDate, ROID) VALUES ('0000000007', 'Delayed', TO_DATE('2024-01-31', 'YYYY-MM-DD'), TO_DATE('2024-02-04', 'YYYY-MM-DD'), '0000000007');
INSERT INTO Shipment (ShipID, Status, ShipmentDate, ExpectedDeliveryDate, ROID) VALUES ('0000000008', 'Delivered', TO_DATE('2024-02-02', 'YYYY-MM-DD'), TO_DATE('2024-02-06', 'YYYY-MM-DD'), '0000000008');
INSERT INTO Shipment (ShipID, Status, ShipmentDate, ExpectedDeliveryDate, ROID) VALUES ('0000000009', 'Shipped', TO_DATE('2024-02-06', 'YYYY-MM-DD'), TO_DATE('2024-02-10', 'YYYY-MM-DD'), '0000000009');
INSERT INTO Shipment (ShipID, Status, ShipmentDate, ExpectedDeliveryDate, ROID) VALUES ('0000000010', 'Delivered', TO_DATE('2024-02-11', 'YYYY-MM-DD'), TO_DATE('2024-02-15', 'YYYY-MM-DD'), '0000000010');

INSERT INTO Payment (PayID, Status, PaymentDate, PaymentMethod, AmountPaid, ROID) VALUES ('0000000001', 'Completed', TO_DATE('2024-01-03', 'YYYY-MM-DD'), 'Credit Card', 500.00, '0000000001');
INSERT INTO Payment (PayID, Status, PaymentDate, PaymentMethod, AmountPaid, ROID) VALUES ('0000000002', 'Completed', TO_DATE('2024-01-07', 'YYYY-MM-DD'), 'Bank Transfer', 1500.00, '0000000002');
INSERT INTO Payment (PayID, Status, PaymentDate, PaymentMethod, AmountPaid, ROID) VALUES ('0000000003', 'Failed', TO_DATE('2024-01-12', 'YYYY-MM-DD'), 'PayPal', 750.00, '0000000003');
INSERT INTO Payment (PayID, Status, PaymentDate, PaymentMethod, AmountPaid, ROID) VALUES ('0000000004', 'Completed', TO_DATE('2024-01-17', 'YYYY-MM-DD'), 'Credit Card', 3000.00, '0000000004');
INSERT INTO Payment (PayID, Status, PaymentDate, PaymentMethod, AmountPaid, ROID) VALUES ('0000000005', 'Refunded', TO_DATE('2024-01-22', 'YYYY-MM-DD'), 'Bank Transfer', 2000.00, '0000000005');
INSERT INTO Payment (PayID, Status, PaymentDate, PaymentMethod, AmountPaid, ROID) VALUES ('0000000006', 'Processing', TO_DATE('2024-01-27', 'YYYY-MM-DD'), 'PayPal', 1250.00, '0000000006');
INSERT INTO Payment (PayID, Status, PaymentDate, PaymentMethod, AmountPaid, ROID) VALUES ('0000000007', 'Completed', TO_DATE('2024-02-01', 'YYYY-MM-DD'), 'Credit Card', 1750.00, '0000000007');
INSERT INTO Payment (PayID, Status, PaymentDate, PaymentMethod, AmountPaid, ROID) VALUES ('0000000008', 'Cancelled', TO_DATE('2024-02-03', 'YYYY-MM-DD'), 'Bank Transfer', 1100.00, '0000000008');
INSERT INTO Payment (PayID, Status, PaymentDate, PaymentMethod, AmountPaid, ROID) VALUES ('0000000009', 'Completed', TO_DATE('2024-02-07', 'YYYY-MM-DD'), 'Credit Card', 950.00, '0000000009');
INSERT INTO Payment (PayID, Status, PaymentDate, PaymentMethod, AmountPaid, ROID) VALUES ('0000000010', 'Failed', TO_DATE('2024-02-12', 'YYYY-MM-DD'), 'PayPal', 1400.00, '0000000010');

INSERT INTO OrderLine (OID, QuantityOrder, PID, ROID) VALUES ('0000000001', 100, '0000000001', '0000000001');
INSERT INTO OrderLine (OID, QuantityOrder, PID, ROID) VALUES ('0000000002', 200, '0000000002', '0000000002');
INSERT INTO OrderLine (OID, QuantityOrder, PID, ROID) VALUES ('0000000003', 150, '0000000003', '0000000003');
INSERT INTO OrderLine (OID, QuantityOrder, PID, ROID) VALUES ('0000000004', 75, '0000000004', '0000000004');
INSERT INTO OrderLine (OID, QuantityOrder, PID, ROID) VALUES ('0000000005', 50, '0000000005', '0000000005');
INSERT INTO OrderLine (OID, QuantityOrder, PID, ROID) VALUES ('0000000006', 125, '0000000006', '0000000006');
INSERT INTO OrderLine (OID, QuantityOrder, PID, ROID) VALUES ('0000000007', 175, '0000000007', '0000000007');
INSERT INTO OrderLine (OID, QuantityOrder, PID, ROID) VALUES ('0000000008', 100, '0000000008', '0000000008');
INSERT INTO OrderLine (OID, QuantityOrder, PID, ROID) VALUES ('0000000009', 120, '0000000009', '0000000009');
INSERT INTO OrderLine (OID, QuantityOrder, PID, ROID) VALUES ('0000000010', 140, '0000000010', '0000000010');
