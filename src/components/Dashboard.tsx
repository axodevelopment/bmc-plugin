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
  Button,
  Card,
  CardBody
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

    const getBmcData = async () => {
      
      const devices: Device[] = [
        {
          name: "Device - GSO", powerControls: [1].map(createPseudoDevice), networkInterfaces: createPseudoNetworkInterfaces(),
          serviceTag: 'GS06DV2',
          biosVersion: '2.15.0',
          idracFirmwareVersion: '5.10.50.00',
          ipAddress: 'https://192.168.31.11/',
          idracMacAddress: '4c:d9:8f:26:6e:3c'
        },
        {
          name: "Device - GSN", powerControls: [9].map(createPseudoDevice), networkInterfaces: createPseudoNetworkInterfaces(),
          serviceTag: 'GSN2DV2',
          biosVersion: '2.14.2',
          idracFirmwareVersion: '5.10.50.00',
          ipAddress: 'https://192.168.31.12/',
          idracMacAddress: '4c:d9:8f:20:4a:86'
        },
        {
          name: "Device - 8FT", powerControls: [7].map(createPseudoDevice), networkInterfaces: createPseudoNetworkInterfaces(),
          serviceTag: '8FT1PX2',
          biosVersion: '2.15.0',
          idracFirmwareVersion: '5.10.50.00',
          ipAddress: 'https://192.168.31.12/',
          idracMacAddress: '54:bf:64:fb:5e:ee'
        },
        {
          name: "Device - COJ", powerControls: [4].map(createPseudoDevice), networkInterfaces: createPseudoNetworkInterfaces(),
          serviceTag: 'COJKPY2',
          biosVersion: '2.13.3',
          idracFirmwareVersion: '5.10.50.00',
          ipAddress: 'https://192.168.31.22/',
          idracMacAddress: 'f4:02:70:b5:12:26'
        }
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
        <PageSection variant="light" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
          <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }}>
            <FlexItem>
              <Title headingLevel="h1" style={{ fontSize: '2.5rem', fontWeight: 300, textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
                {t('Device Dashboard')}
              </Title>
            </FlexItem>
          </Flex>
        </PageSection>
        <PageSection variant="light" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
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
            <div style={{ display: 'grid', gap: '24px' }}>
              {devices.map((device, deviceIndex) => (
                <Card
                  key={deviceIndex}
                  style={{
                    border: 'none',
                    borderRadius: '16px',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
                    background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
                    overflow: 'hidden'
                  }}
                >
                  <CardBody style={{ padding: '32px' }}>
                    {/* Device Header with Action Button */}
                    <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }} style={{ marginBottom: '32px' }}>
                      <FlexItem>
                        <Title 
                          headingLevel="h2" 
                          size="xl" 
                          style={{ 
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            fontWeight: 600,
                            marginBottom: '8px'
                          }}
                        >
                          {device.name}
                        </Title>
                        <div style={{ 
                          display: 'inline-block',
                          backgroundColor: '#e3f2fd',
                          color: '#1976d2',
                          padding: '4px 12px',
                          borderRadius: '20px',
                          fontSize: '14px',
                          fontWeight: 500
                        }}>
                          LABEL: {device.serviceTag}
                        </div>
                      </FlexItem>
                      <FlexItem>
                        <Button 
                          variant="primary" 
                          onClick={() => alert(`Graceful Reboot for ${device.name}`)}
                          style={{
                            background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
                            border: 'none',
                            borderRadius: '12px',
                            padding: '12px 24px',
                            fontWeight: 600,
                            boxShadow: '0 4px 12px rgba(255, 107, 107, 0.3)',
                            transition: 'all 0.3s ease'
                          }}
                        >
                          Graceful Reboot
                        </Button>
                      </FlexItem>
                    </Flex>

                    {/* Power Controls Section - Priority Focus */}
                    <div style={{ marginBottom: '32px' }}>
                      <Title 
                        headingLevel="h3" 
                        size="lg" 
                        style={{ 
                          color: '#2c3e50',
                          marginBottom: '20px',
                          fontSize: '1.5rem',
                          fontWeight: 600,
                          borderBottom: '3px solid #3498db',
                          paddingBottom: '8px',
                          display: 'inline-block'
                        }}
                      >
                        ⚡ Power Controls
                      </Title>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
                        {device.powerControls.map((control, controlIndex) => {
                          const powerUsagePercentage = (control.PowerConsumedWatts / control.PowerCapacityWatts) * 100;
                          const isOverCapacity = powerUsagePercentage > 100;

                          return (
                            <div
                              key={controlIndex}
                              className={isOverCapacity ? 'flash': ''}
                              style={{
                                border: `3px solid ${isOverCapacity ? '#e74c3c' : '#27ae60'}`,
                                borderRadius: '16px',
                                padding: '20px',
                                background: isOverCapacity 
                                  ? 'linear-gradient(135deg, #fff5f5 0%, #fed7d7 100%)' 
                                  : 'linear-gradient(135deg, #f0fff4 0%, #c6f6d5 100%)',
                                position: 'relative',
                                transition: 'all 0.3s ease',
                                boxShadow: `0 4px 16px ${isOverCapacity ? 'rgba(231, 76, 60, 0.2)' : 'rgba(39, 174, 96, 0.2)'}`,
                              }}
                            >
                              <Flex alignItems={{ default: 'alignItemsCenter' }} style={{ height: '120px' }}>
                                <FlexItem flex={{ default: 'flex_1' }}>
                                  <Title headingLevel="h4" size="md" style={{ marginBottom: '12px', color: '#2c3e50' }}>
                                    {control.Name}
                                  </Title>
                                  <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
                                    <p style={{ margin: '4px 0', display: 'flex', justifyContent: 'space-between' }}>
                                      <span>Power Consumed:</span>
                                      <strong style={{ color: isOverCapacity ? '#e74c3c' : '#27ae60' }}>
                                        {control.PowerConsumedWatts.toFixed(2)} W
                                      </strong>
                                    </p>
                                    <p style={{ margin: '4px 0', display: 'flex', justifyContent: 'space-between' }}>
                                      <span>Power Capacity:</span>
                                      <strong>{control.PowerCapacityWatts.toFixed(2)} W</strong>
                                    </p>
                                  </div>
                                </FlexItem>
                                <FlexItem>
                                  <div
                                    style={{
                                      width: '32px',
                                      height: '100px',
                                      backgroundColor: '#e0e0e0',
                                      borderRadius: '16px',
                                      overflow: 'hidden',
                                      position: 'relative',
                                      marginLeft: '16px',
                                      boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)'
                                    }}
                                  >
                                    <div
                                      style={{
                                        position: 'absolute',
                                        bottom: '0',
                                        width: '100%',
                                        height: `${Math.min(powerUsagePercentage, 100)}%`,
                                        background: isOverCapacity 
                                          ? 'linear-gradient(0deg, #e74c3c 0%, #ff6b6b 100%)'
                                          : 'linear-gradient(0deg, #27ae60 0%, #2ecc71 100%)',
                                        transition: 'height 0.5s ease',
                                        borderRadius: '0 0 16px 16px'
                                      }}
                                    />
                                  </div>
                                </FlexItem>
                              </Flex>
                              <div
                                style={{
                                  textAlign: 'center',
                                  marginTop: '12px',
                                  fontWeight: 700,
                                  fontSize: '16px',
                                  color: isOverCapacity ? '#e74c3c' : '#27ae60',
                                }}
                              >
                                {powerUsagePercentage.toFixed(1)}% of Capacity
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Device Details and Networking in Grid Layout */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                      
                      {/* Device Details Section */}
                      <div>
                        <Title 
                          headingLevel="h3" 
                          size="lg" 
                          style={{ 
                            color: '#2c3e50',
                            marginBottom: '16px',
                            fontSize: '1.3rem',
                            fontWeight: 600
                          }}
                        >
                          🖥️ Device Details
                        </Title>
                        <details 
                          className="details-section" 
                          style={{
                            backgroundColor: '#ffffff',
                            border: '2px solid #e1e8ed',
                            borderRadius: '12px',
                            padding: '16px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                          }}
                        >
                          <summary style={{ 
                            cursor: 'pointer', 
                            fontWeight: 600, 
                            color: '#3498db',
                            fontSize: '16px',
                            marginBottom: '12px',
                            padding: '8px 0'
                          }}>
                            Hardware Information
                          </summary>
                          <div style={{ paddingTop: '12px', fontSize: '14px', lineHeight: '1.8' }}>
                            <p style={{ margin: '8px 0', display: 'flex', justifyContent: 'space-between' }}>
                              <span><b>Service Tag:</b></span>
                              <span style={{ fontFamily: 'monospace', background: '#f8f9fa', padding: '2px 6px', borderRadius: '4px' }}>
                                {device.serviceTag}
                              </span>
                            </p>
                            <p style={{ margin: '8px 0', display: 'flex', justifyContent: 'space-between' }}>
                              <span><b>BIOS Version:</b></span>
                              <span style={{ fontFamily: 'monospace', background: '#f8f9fa', padding: '2px 6px', borderRadius: '4px' }}>
                                {device.biosVersion}
                              </span>
                            </p>
                            <p style={{ margin: '8px 0', display: 'flex', justifyContent: 'space-between' }}>
                              <span><b>iDRAC Firmware:</b></span>
                              <span style={{ fontFamily: 'monospace', background: '#f8f9fa', padding: '2px 6px', borderRadius: '4px' }}>
                                {device.idracFirmwareVersion}
                              </span>
                            </p>
                            <p style={{ margin: '8px 0', display: 'flex', justifyContent: 'space-between' }}>
                              <span><b>IP Address:</b></span>
                              <span style={{ fontFamily: 'monospace', background: '#f8f9fa', padding: '2px 6px', borderRadius: '4px' }}>
                                {device.ipAddress}
                              </span>
                            </p>
                            <p style={{ margin: '8px 0', display: 'flex', justifyContent: 'space-between' }}>
                              <span><b>iDRAC MAC:</b></span>
                              <span style={{ fontFamily: 'monospace', background: '#f8f9fa', padding: '2px 6px', borderRadius: '4px' }}>
                                {device.idracMacAddress}
                              </span>
                            </p>
                          </div>
                        </details>
                      </div>

                      {/* Networking Section */}
                      <div>
                        <Title 
                          headingLevel="h3" 
                          size="lg" 
                          style={{ 
                            color: '#2c3e50',
                            marginBottom: '16px',
                            fontSize: '1.3rem',
                            fontWeight: 600
                          }}
                        >
                          🌐 Networking
                        </Title>
                        <details 
                          className="details-section"
                          style={{
                            backgroundColor: '#ffffff',
                            border: '2px solid #e1e8ed',
                            borderRadius: '12px',
                            padding: '16px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                          }}
                        >
                          <summary style={{ 
                            cursor: 'pointer', 
                            fontWeight: 600, 
                            color: '#3498db',
                            fontSize: '16px',
                            marginBottom: '12px',
                            padding: '8px 0'
                          }}>
                            Network Interfaces ({device.networkInterfaces.filter(nic => nic.linkStatus === "Up").length} Active)
                          </summary>
                          <div style={{ paddingTop: '12px' }}>
                            <table 
                              className="network-table" 
                              style={{
                                width: '100%',
                                borderCollapse: 'collapse',
                                fontSize: '13px'
                              }}
                            >
                              <thead>
                                <tr style={{ backgroundColor: '#f8f9fa' }}>
                                  <th style={{ padding: '8px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Port</th>
                                  <th style={{ padding: '8px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Status</th>
                                  <th style={{ padding: '8px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Speed</th>
                                  <th style={{ padding: '8px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Protocol</th>
                                </tr>
                              </thead>
                              <tbody>
                                {device.networkInterfaces.map((nic, nicIndex) => (
                                  <React.Fragment key={nicIndex}>
                                    <tr style={{ borderBottom: '1px solid #e9ecef' }}>
                                      <td style={{ padding: '8px', fontWeight: 600 }}>{nic.port}</td>
                                      <td style={{ padding: '8px' }}>
                                        <span style={{
                                          padding: '2px 8px',
                                          borderRadius: '12px',
                                          fontSize: '12px',
                                          fontWeight: 600,
                                          backgroundColor: nic.linkStatus === 'Up' ? '#d4edda' : '#f8d7da',
                                          color: nic.linkStatus === 'Up' ? '#155724' : '#721c24'
                                        }}>
                                          {nic.linkStatus}
                                        </span>
                                      </td>
                                      <td style={{ padding: '8px', fontFamily: 'monospace' }}>{nic.linkSpeed}</td>
                                      <td style={{ padding: '8px' }}>{nic.protocol}</td>
                                    </tr>
                                    {nic.linkStatus === "Up" && (
                                      <tr>
                                        <td colSpan={4} style={{ padding: '0', backgroundColor: '#f8f9fa' }}>
                                          <details style={{ margin: '8px', fontSize: '12px' }}>
                                            <summary style={{ cursor: 'pointer', padding: '4px', color: '#6c757d' }}>
                                              NIC Details
                                            </summary>
                                            <div style={{ padding: '8px', backgroundColor: 'white', margin: '4px', borderRadius: '4px' }}>
                                              <p><b>OS Driver State:</b> {nic.partitionProperties.osDriverState}</p>
                                              <p><b>LAN Driver Version:</b> {nic.partitionProperties.lanDriverVersion}</p>
                                              <p><b>PCI Device ID:</b> {nic.partitionProperties.pciDeviceId}</p>
                                              <p><b>Physical MAC:</b> {nic.macAddresses.physical}</p>
                                              <p><b>Virtual MAC:</b> {nic.macAddresses.virtual}</p>
                                            </div>
                                          </details>
                                        </td>
                                      </tr>
                                    )}
                                  </React.Fragment>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </details>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          )}
        </PageSection>
        <BackToTop isAlwaysVisible />
      </Page>
    </>
  );
}