import { Chart as ChartJS } from 'chart.js/auto'
import { Line } from 'react-chartjs-2'
import { CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ChartOptions } from 'chart.js';
import Traffic from '../../../types/Traffic';
import { useEffect, useState } from 'react';
import { getSiteTraffic } from '../../../api/HeadlinesAPI';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const SiteTraffic = () => {

  const [siteTraffic, setSiteTraffic] = useState<Traffic[]>([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getSiteTraffic();
        setSiteTraffic(data)
      } catch (error) {
        // console.error("Error fetching site traffic:", error);
      }
    }

    fetch();
  }, [])

  // Process the traffic data to get counts by hour/day
  const processData = (data: Traffic[]) => {
    // First, create a map to store hourly counts with timestamp keys
    const hourlyMap = new Map();
    
    data.forEach(entry => {
      const date = new Date(entry.time);
      // Create a key that represents the hour (ignoring minutes/seconds)
      const hourKey = new Date(date);
      hourKey.setMinutes(0, 0, 0); // Round down to the hour
      
      // Get or initialize the count for this hour
      const currentCount = hourlyMap.get(hourKey.getTime()) || 0;
      hourlyMap.set(hourKey.getTime(), currentCount + 1);
    });
    
    // Convert the map to an array and sort by time
    const sortedEntries = Array.from(hourlyMap.entries())
      .sort(([timeA], [timeB]) => timeA - timeB);
    
    // Extract labels and values
    const labels = sortedEntries.map(([time]) => {
      const date = new Date(Number(time));
      return `${date.getDate()}/${date.getMonth()+1} ${date.getHours()}:00`;
    });
    
    const values = sortedEntries.map(([, count]) => count);
    
    return { labels, values };
  };

  const processedData = processData(siteTraffic || []);

  const chartData = {
    labels: processedData.labels,
    datasets: [
      {
        label: 'Visits',
        data: processedData.values,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.1,
        fill: true
      }
    ]
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      tooltip: {
        enabled: true,
        mode: 'index',
        intersect: false,
      }
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Time',
          color: '#666',
          font: {
            weight: 'bold'
          }
        },
        grid: {
          display: false
        }
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Visits',
          color: '#666',
          font: {
            weight: 'bold'
          }
        },
        min: 0,
        ticks: {
          stepSize: 1,
          // For Chart.js v4+, use 'precision' instead of 'precision'
          precision: 0
        }
      }
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    }
  };

  return (
    <div>
      <div className="card shadow-sm">
        <div className="card-body">
          <h4 className="fw-bold">Site Traffic</h4>
          <hr />
          {siteTraffic && siteTraffic.length > 0 ? (
            <div style={{ height: '400px' }}>
              <Line data={chartData} options={options} />
            </div>
          ) : (
            <p className="text-muted text-center">No traffic data available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SiteTraffic;