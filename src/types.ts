/* eslint-disable @typescript-eslint/no-explicit-any */
import { K8sResourceCommon } from '@openshift-console/dynamic-plugin-sdk';

/* first pass vc */
export interface VirtualCluster extends K8sResourceCommon {
  apiVersion: string;
  kind: string;
  metadata: {
    name: string;
    namespace: string;
    labels?: { [key: string]: string };
    [key: string]: any; // This allows other optional metadata fields
  };
  //spec?: VirtualClusterSpec;
  //status?: VirtualClusterStatus;
}

export interface VirtualClusterList extends K8sResourceCommon {
  kind: string;
  apiVersion: string;
  metadata: {
    resourceVersion: string;
  };
  items: VirtualCluster[];
}

export interface Device {
  name: string;
  serviceTag: string;
  biosVersion: string;
  idracFirmwareVersion: string;
  ipAddress: string;
  idracMacAddress: string;
  powerControls: PowerControl[];
  networkInterfaces: NetworkInterface[];
}

export interface PowerControl {
    "@odata.context": string;
    "@odata.type": string;
    "@odata.id": string;
    Name: string;
    MemberId: string;
    PowerAllocatedWatts: number;
    PowerAvailableWatts: number;
    PowerCapacityWatts: number;
    PowerConsumedWatts: number;
    PowerLimit: PowerLimit;
    PowerMetrics: PowerMetrics;
    PowerRequestedWatts: number;
}

// Define the PowerLimit type
type PowerLimit = {
    LimitInWatts: number; // Example properties
    LimitException: string; // Modify according to actual fields
  };
  
  // Define the PowerMetrics type
  type PowerMetrics = {
    AverageConsumedWatts: number; // Example properties
    MaxConsumedWatts: number; // Modify according to actual fields
    MinConsumedWatts: number; // Modify according to actual fields
  };

  export interface NetworkInterface {
    port: number;
    linkStatus: string;
    linkSpeed: string;
    protocol: string;
    switchConnectionID: string;
    switchPortConnectionID: string;
    cpuAffinity: string;
    partitionProperties: {
      osDriverState: string;
      lanDriverVersion: string;
      pciDeviceId: string;
    };
    macAddresses: {
      physical: string;
      virtual: string;
    };
  }

// Pseudo data creation functions
export const createPseudoNetworkInterfaces = (): NetworkInterface[] => [
  {
    port: 1, 
    linkStatus: "Up", 
    linkSpeed: "1000 Mbps", 
    protocol: "NIC", 
    switchConnectionID: "Not Available", 
    switchPortConnectionID: "Not Available", 
    cpuAffinity: "N/A",
    partitionProperties: {
      osDriverState: 'Operational',
      lanDriverVersion: '5.14.0-427.49.1.el9_4.x86_64',
      pciDeviceId: '1563'
    },
    macAddresses: {
      physical: 'E4:43:4B:DB:D8:30',
      virtual: 'E4:43:4B:DB:D8:30'
    }
  },
  {
    port: 2, 
    linkStatus: "Down", 
    linkSpeed: "Unknown", 
    protocol: "NIC", 
    switchConnectionID: "No Link", 
    switchPortConnectionID: "No Link", 
    cpuAffinity: "N/A",
    partitionProperties: {
      osDriverState: '',
      lanDriverVersion: '',
      pciDeviceId: ''
    },
    macAddresses: {
      physical: '',
      virtual: ''
    }
  },
  {
    port: 3, 
    linkStatus: "Down", 
    linkSpeed: "Unknown", 
    protocol: "NIC", 
    switchConnectionID: "No Link", 
    switchPortConnectionID: "No Link", 
    cpuAffinity: "N/A",
    partitionProperties: {
      osDriverState: '',
      lanDriverVersion: '',
      pciDeviceId: ''
    },
    macAddresses: {
      physical: '',
      virtual: ''
    }
  },
  {
    port: 4, 
    linkStatus: "Down", 
    linkSpeed: "Unknown", 
    protocol: "NIC", 
    switchConnectionID: "No Link", 
    switchPortConnectionID: "No Link", 
    cpuAffinity: "N/A",
    partitionProperties: {
      osDriverState: '',
      lanDriverVersion: '',
      pciDeviceId: ''
    },
    macAddresses: {
      physical: '',
      virtual: ''
    }
  },
];

export const createPseudoDevice = (id: number): PowerControl => ({
  "@odata.context": `/redfish/v1/PowerControl/${id}`,
  "@odata.type": `#Power.v1_0_0.PowerControl`,
  "@odata.id": `/redfish/v1/PowerControl/${id}`,

  Name: `PD${id}`,
  MemberId: `Device${id}`,
  PowerAllocatedWatts: Math.random() * 100,
  PowerAvailableWatts: 1104,
  PowerCapacityWatts: 1104,
  PowerConsumedWatts: 100 + (Math.random() * 33 + Math.random() * 33 + Math.random() * 33),
  PowerLimit: {
    LimitInWatts: 1104,
    LimitException: "NoLimit",
  },
  PowerMetrics: {
    AverageConsumedWatts: 100 + (Math.random() * 33 + Math.random() * 33 + Math.random() * 33),
    MaxConsumedWatts: Math.random() * 60,
    MinConsumedWatts: Math.random() * 40,
  },
  PowerRequestedWatts: Math.random() * 80,
});

// Mock device data generation
export const generateMockDevices = (): Device[] => [
  {
    name: "Device - GSO", 
    powerControls: [1].map(createPseudoDevice), 
    networkInterfaces: createPseudoNetworkInterfaces(),
    serviceTag: 'GS06DV2',
    biosVersion: '2.15.0',
    idracFirmwareVersion: '5.10.50.00',
    ipAddress: 'https://192.168.31.11/',
    idracMacAddress: '4c:d9:8f:26:6e:3c'
  },
  {
    name: "Device - GSN", 
    powerControls: [9].map(createPseudoDevice), 
    networkInterfaces: createPseudoNetworkInterfaces(),
    serviceTag: 'GSN2DV2',
    biosVersion: '2.14.2',
    idracFirmwareVersion: '5.10.50.00',
    ipAddress: 'https://192.168.31.12/',
    idracMacAddress: '4c:d9:8f:20:4a:86'
  },
  {
    name: "Device - 8FT", 
    powerControls: [7].map(createPseudoDevice), 
    networkInterfaces: createPseudoNetworkInterfaces(),
    serviceTag: '8FT1PX2',
    biosVersion: '2.15.0',
    idracFirmwareVersion: '5.10.50.00',
    ipAddress: 'https://192.168.31.12/',
    idracMacAddress: '54:bf:64:fb:5e:ee'
  },
  {
    name: "Device - COJ", 
    powerControls: [4].map(createPseudoDevice), 
    networkInterfaces: createPseudoNetworkInterfaces(),
    serviceTag: 'COJKPY2',
    biosVersion: '2.13.3',
    idracFirmwareVersion: '5.10.50.00',
    ipAddress: 'https://192.168.31.22/',
    idracMacAddress: 'f4:02:70:b5:12:26'
  }
];