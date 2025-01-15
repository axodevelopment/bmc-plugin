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
  EmptyStateBody
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
      { port: 1, linkStatus: "Up", linkSpeed: "1000 Mbps", protocol: "NIC", switchConnectionID: "Not Available", switchPortConnectionID: "Not Available", cpuAffinity: "N/A" },
      { port: 2, linkStatus: "Down", linkSpeed: "Unknown", protocol: "NIC", switchConnectionID: "No Link", switchPortConnectionID: "No Link", cpuAffinity: "N/A" },
      { port: 3, linkStatus: "Down", linkSpeed: "Unknown", protocol: "NIC", switchConnectionID: "No Link", switchPortConnectionID: "No Link", cpuAffinity: "N/A" },
      { port: 4, linkStatus: "Down", linkSpeed: "Unknown", protocol: "NIC", switchConnectionID: "No Link", switchPortConnectionID: "No Link", cpuAffinity: "N/A" },
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
        { name: "Device - CJO", powerControls: [1, 2].map(createPseudoDevice), networkInterfaces: createPseudoNetworkInterfaces() },
        { name: "Device - CNO", powerControls: [4, 5].map(createPseudoDevice), networkInterfaces: createPseudoNetworkInterfaces() },
        { name: "Device - GNN", powerControls: [7, 8].map(createPseudoDevice), networkInterfaces: createPseudoNetworkInterfaces() },
        { name: "Device - GW2", powerControls: [4, 5].map(createPseudoDevice), networkInterfaces: createPseudoNetworkInterfaces() },
        { name: "Device - OD2", powerControls: [7, 8].map(createPseudoDevice), networkInterfaces: createPseudoNetworkInterfaces() },
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
                    border: '1px solid #ccc',
                    padding: '20px',
                    borderRadius: '8px',
                  }}
                >
                  <Title headingLevel="h2" size="lg">
                    {device.name}
                  </Title>
  
                  {/* Power Controls Section */}
                  <Title headingLevel="h3" size="lg" style={{ marginTop: '20px' }}>
                    Power Controls
                  </Title>
                  <Flex>
                    {device.powerControls.map((control, controlIndex) => {
                      const powerUsagePercentage = (control.PowerConsumedWatts / control.PowerCapacityWatts) * 100;
                      const isOverCapacity = powerUsagePercentage > 100;
                      const temperature = Math.random() * 30 + 60; // Mock temperature
                      const btusUsed = control.PowerConsumedWatts * 3.412; // BTU calculation
  
                      return (
                        <FlexItem
                          key={controlIndex}
                          style={{
                            width: '300px',
                            margin: '10px',
                          }}
                        >
                          <div
                            className={isOverCapacity ? 'flash' : ''}
                            style={{
                              border: `2px solid ${isOverCapacity ? 'red' : 'green'}`,
                              borderRadius: '8px',
                              padding: '10px',
                              backgroundColor: isOverCapacity ? '#ffe6e6' : '#e6ffe6',
                            }}
                          >
                            <Title headingLevel="h4" size="md">
                              {control.Name}
                            </Title>
                            <p>
                              <b>Power Consumed:</b> {control.PowerConsumedWatts.toFixed(2)} W
                            </p>
                            <p>
                              <b>BTUs Used:</b> {btusUsed.toFixed(2)} BTU/h
                            </p>
                            <p>
                              <b>Temperature:</b> {temperature.toFixed(1)}°F
                            </p>
                            <div style={{ marginTop: '10px' }}>
                              <div
                                style={{
                                  height: '20px',
                                  width: '100%',
                                  backgroundColor: '#ccc',
                                  borderRadius: '10px',
                                  overflow: 'hidden',
                                }}
                              >
                                <div
                                  style={{
                                    height: '100%',
                                    width: `${Math.min(powerUsagePercentage, 100)}%`,
                                    backgroundColor: isOverCapacity ? 'red' : 'green',
                                  }}
                                />
                              </div>
                              <p style={{ textAlign: 'center', margin: '5px 0 0' }}>
                                {powerUsagePercentage.toFixed(1)}% of Capacity
                              </p>
                            </div>
                          </div>
                        </FlexItem>
                      );
                    })}
                  </Flex>
  
                  {/* Networking Section */}
                  <Title headingLevel="h3" size="lg" style={{ marginTop: '20px' }}>
                    Networking
                  </Title>
                  <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
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
                        <tr key={nicIndex} style={{ borderBottom: '1px solid #ccc' }}>
                          <td>{nic.port}</td>
                          <td>{nic.linkStatus}</td>
                          <td>{nic.linkSpeed}</td>
                          <td>{nic.protocol}</td>
                          <td>{nic.switchConnectionID}</td>
                          <td>{nic.switchPortConnectionID}</td>
                          <td>{nic.cpuAffinity}</td>
                        </tr>
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