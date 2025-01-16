/* eslint-disable react/no-children-prop */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/jsx-no-undef */
import * as React from 'react';
import Helmet from 'react-helmet';
import { useTranslation } from 'react-i18next';
import { Page, PageSection, Title, Flex, FlexItem, BackToTop,
  EmptyState,
  EmptyStateIcon,
  EmptyStateBody,
  Button
} from '@patternfly/react-core';
import './example.css';
import { useEffect, useState } from 'react';
import { Device, PowerControl, NetworkInterface } from 'src/types';
//import { Link } from 'react-router-dom';
//PlusCircleIcon
import { CubesIcon } from '@patternfly/react-icons';



export default function ExamplePage() {
  const { t } = useTranslation('plugin__my-openshift-console-plugin');

  const [devices, setDevices] = useState<Device[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const version = 'Version: v0.0.1'

  useEffect(() => {

    const createPseudoNetworkInterfaces = (): NetworkInterface[] => [
      {
        port: 1, linkStatus: "Up", linkSpeed: "1000 Mbps", protocol: "NIC", switchConnectionID: "Not Available", switchPortConnectionID: "Not Available", cpuAffinity: "N/A",
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
        port: 2, linkStatus: "Down", linkSpeed: "Unknown", protocol: "NIC", switchConnectionID: "No Link", switchPortConnectionID: "No Link", cpuAffinity: "N/A",
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
        port: 3, linkStatus: "Down", linkSpeed: "Unknown", protocol: "NIC", switchConnectionID: "No Link", switchPortConnectionID: "No Link", cpuAffinity: "N/A",
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
        port: 4, linkStatus: "Down", linkSpeed: "Unknown", protocol: "NIC", switchConnectionID: "No Link", switchPortConnectionID: "No Link", cpuAffinity: "N/A",
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

    const createPseudoDevice = (id: number): PowerControl => ({
      "@odata.context": `/redfish/v1/PowerControl/${id}`,
      "@odata.type": `#Power.v1_0_0.PowerControl`,
      "@odata.id": `/redfish/v1/PowerControl/${id}`,
    
      Name: `pd${id}`,
      MemberId: `Device${id}`,
      PowerAllocatedWatts: Math.random() * 100,
      PowerAvailableWatts: Math.random() * 100,
      PowerCapacityWatts: Math.random() * 200,
      PowerConsumedWatts: Math.random() * 50,
      PowerLimit: {
        LimitInWatts: Math.random() * 100,
        LimitException: "NoLimit",
      },
      PowerMetrics: {
        AverageConsumedWatts: Math.random() * 50,
        MaxConsumedWatts: Math.random() * 60,
        MinConsumedWatts: Math.random() * 40,
      },
      PowerRequestedWatts: Math.random() * 80,
    });

    const getBmcData = async () => {
      
      const devices: Device[] = [
        {
          name: "Device - CJO", powerControls: [1].map(createPseudoDevice), networkInterfaces: createPseudoNetworkInterfaces(),
          serviceTag: 'CJO6DV2',
          biosVersion: '',
          idracFirmwareVersion: '',
          ipAddress: 'https://192.168.31.11/',
          idracMacAddress: '4c:d9:8f:26:6e:3c'
        },
        {
          name: "Device - CNO", powerControls: [9].map(createPseudoDevice), networkInterfaces: createPseudoNetworkInterfaces(),
          serviceTag: 'CNO6DV2',
          biosVersion: '',
          idracFirmwareVersion: '',
          ipAddress: 'https://192.168.31.11/',
          idracMacAddress: '4c:d9:8f:26:6e:3c'
        },
        {
          name: "Device - GNN", powerControls: [7].map(createPseudoDevice), networkInterfaces: createPseudoNetworkInterfaces(),
          serviceTag: 'GNN4DV2',
          biosVersion: '',
          idracFirmwareVersion: '',
          ipAddress: 'https://192.168.31.11/',
          idracMacAddress: '4c:d9:8f:26:6e:3c'
        },
        {
          name: "Device - GW2", powerControls: [4].map(createPseudoDevice), networkInterfaces: createPseudoNetworkInterfaces(),
          serviceTag: 'GW22DV2',
          biosVersion: '',
          idracFirmwareVersion: '',
          ipAddress: 'https://192.168.31.11/',
          idracMacAddress: '4c:d9:8f:26:6e:3c'
        },
        {
          name: "Device - OD2", powerControls: [8].map(createPseudoDevice), networkInterfaces: createPseudoNetworkInterfaces(),
          serviceTag: '0D23DV2',
          biosVersion: '',
          idracFirmwareVersion: '',
          ipAddress: 'https://192.168.31.11/',
          idracMacAddress: '4c:d9:8f:26:6e:3c'
        },
      ];

      setDevices(devices);

    };

    getBmcData();
    setError(null)
    setIsLoading(false)
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error} {version}</div>;
  }

  return (
    <>
      <Helmet>
        <title data-test="example-page-title">{t('Dashboard')}</title>
      </Helmet>
      <Page>
        <PageSection variant="light">
          <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }}>
            <FlexItem>
              <Title headingLevel="h1">{t('Device Dashboard')}</Title>
            </FlexItem>
          </Flex>
        </PageSection>
        <PageSection variant="light">
          {devices.length === 0 ? (
            <EmptyState>
              <EmptyStateIcon icon={CubesIcon} />
              <Title headingLevel="h4" size="lg">
                No Devices Found
              </Title>
              <EmptyStateBody>
                No devices available. Add devices to monitor their power usage and networking details.
              </EmptyStateBody>
            </EmptyState>
          ) : (
            <div>
              {devices.map((device, deviceIndex) => (
                <div
                  key={deviceIndex}
                  style={{
                    marginBottom: '20px',
                    border: '4px solid rgb(238, 0, 0)',
                    borderRadius: '8px',
                    padding: '20px',
                    backgroundColor: '#F0F8FF',
                    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }}>
                    <FlexItem>
                      <Title headingLevel="h2" size="lg">
                        {device.name}
                      </Title>
                      <div className="device-details">
                        <p>
                          <b>Service Tag:</b> {device.serviceTag}
                        </p>
                        <p>
                          <b>BIOS Version:</b> {device.biosVersion}
                        </p>
                        <p>
                          <b>iDRAC Firmware Version:</b> {device.idracFirmwareVersion}
                        </p>
                        <p>
                          <b>IP Address:</b> {device.ipAddress}
                        </p>
                        <p>
                          <b>iDRAC MAC Address:</b> {device.idracMacAddress}
                        </p>
                      </div>
                    </FlexItem>
                    <FlexItem>
                      <Button variant="primary" onClick={() => alert(`Graceful Reboot for ${device.name}`)}>
                        Graceful Reboot
                      </Button>
                    </FlexItem>
                  </Flex>
  
                  {/* Power Controls Section */}
                  <Title headingLevel="h3" size="lg" style={{ marginTop: '20px' }}>
                    Power Controls
                  </Title>
                  <Flex>
                    {device.powerControls.map((control, controlIndex) => {
                      const powerUsagePercentage = (control.PowerConsumedWatts / control.PowerCapacityWatts) * 100;
                      const isOverCapacity = powerUsagePercentage > 100;
  
                      return (
                        <FlexItem key={controlIndex} style={{ width: '300px', margin: '10px', position: 'relative' }}>
                          <div
                            className={isOverCapacity ? 'flash': ''}
                            style={{
                              border: `2px solid ${isOverCapacity ? 'red' : 'green'}`,
                              borderRadius: '8px',
                              padding: '10px',
                              backgroundColor: isOverCapacity ? '#ffe6e6' : '#e6ffe6',
                              height: '150px',
                              display: 'flex',
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                            }}
                          >
                            <div style={{ flex: '1 1 auto' }}>
                              <Title headingLevel="h4" size="md">
                                {control.Name}
                              </Title>
                              <p>
                                <b>Power Consumed:</b> {control.PowerConsumedWatts.toFixed(2)} W
                              </p>
                              <p>
                                <b>Power Capacity:</b> {control.PowerCapacityWatts.toFixed(2)} W
                              </p>
                            </div>
                            <div
                              style={{
                                width: '20px',
                                height: '100%',
                                backgroundColor: '#ccc',
                                borderRadius: '10px',
                                overflow: 'hidden',
                                position: 'relative',
                                marginLeft: '10px',
                              }}
                            >
                              <div
                                style={{
                                  position: 'absolute',
                                  bottom: '0',
                                  width: '100%',
                                  height: `${Math.min(powerUsagePercentage, 100)}%`,
                                  backgroundColor: isOverCapacity ? 'red' : 'green',
                                }}
                              />
                            </div>
                          </div>
                          <p
                            style={{
                              textAlign: 'center',
                              marginTop: '5px',
                              fontWeight: 'bold',
                              color: isOverCapacity ? 'red' : 'green',
                            }}
                          >
                            {powerUsagePercentage.toFixed(1)}% of Capacity
                          </p>
                        </FlexItem>
                      );
                    })}
                  </Flex>
  
                  {/* Networking Section */}
                  <Title headingLevel="h3" size="lg" style={{ marginTop: '20px' }}>
                    Networking
                  </Title>
                  {/*</div>style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>*/}
                  <table className="network-table">
                    <thead>
                      <tr>
                        <th>Port</th>
                        <th>Link Status</th>
                        <th>Link Speed</th>
                        <th>Protocol</th>
                        <th>Switch Connection ID</th>
                        <th>Switch Port Connection ID</th>
                        <th>CPU Affinity</th>
                      </tr>
                    </thead>
                    <tbody>
                      {device.networkInterfaces.map((nic, nicIndex) => (
                        <React.Fragment key={nicIndex}>
                          <tr>
                            <td>{nic.port}</td>
                            <td>{nic.linkStatus}</td>
                            <td>{nic.linkSpeed}</td>
                            <td>{nic.protocol}</td>
                            <td>{nic.switchConnectionID}</td>
                            <td>{nic.switchPortConnectionID}</td>
                            <td>{nic.cpuAffinity}</td>
                          </tr>
                          {nic.linkStatus === "Up" && (
                          <tr>
                            <td colSpan={7}>
                              {/* style={{ padding: '10px', backgroundColor: '#f9f9f9', borderRadius: '4px' } */}
                              <details className="details-section">
                                <summary>NIC Details</summary>
                                <p>
                                  <b>OS Driver State:</b> {nic.partitionProperties.osDriverState}
                                </p>
                                <p>
                                  <b>LAN Driver Version:</b> {nic.partitionProperties.lanDriverVersion}
                                </p>
                                <p>
                                  <b>PCI Device ID:</b> {nic.partitionProperties.pciDeviceId}
                                </p>
                                <p>
                                  <b>Physical MAC Address:</b> {nic.macAddresses.physical}
                                </p>
                                <p>
                                  <b>Virtual MAC Address:</b> {nic.macAddresses.virtual}
                                </p>
                              </details>
                            </td>
                          </tr>)}
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          )}
        </PageSection>
        <BackToTop isAlwaysVisible />
      </Page>
    </>
  );
  
  
}