/* eslint-disable @typescript-eslint/no-explicit-any */
import { K8sResourceCommon } from '@openshift-console/dynamic-plugin-sdk';

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
  }