import { flushPromises, mount, shallowMount } from '@vue/test-utils';
import WeatherReport from './WeatherReport.vue';

const mockData = {
  location: {
    localtime: new Date(),
    name: 'Test City',
    region: 'Test Region',
  },
  current: {
    temp_c: 20,
    temp_f: 68,
    precip_mm: 5,
    condition: {
      text: 'Partly cloudy',
      icon: 'https://example.com/icon.png',
    },
    wind_degree: 180,
    wind_kph: 10,
    wind_mph: 6,
  }
};

describe('WeatherReport', () => {
  it("should render the component without crashing", (): void => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockData)
      }) as any
    );

    const wrapper = shallowMount<typeof WeatherReport>(WeatherReport, {
      props: {
        coords: {
          latitude: 0,
          longitude: 0
        },
      },
    });

    expect(wrapper).toBeTruthy();
  });

  it('displays loading message when data is undefined', (): void => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockData),
      })) as any;
  
    const wrapper = shallowMount(WeatherReport, {
      props: {
        coords: {
          latitude: 0,
          longitude: 0,
        },
      },
    });
  
    expect(wrapper.text()).toContain('Loading...');
  });

  it('displays loading message when data is defined', async (): Promise<void> => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockData),
      })) as any;
  
    const wrapper = mount(WeatherReport, {
      props: {
        coords: {
          latitude: 0,
          longitude: 0,
        },
      },
    });

    await flushPromises();
  
    expect(wrapper.text()).toContain(mockData.current.condition.text)
    expect(wrapper.text()).toContain(mockData.current.temp_c)
    expect(wrapper.text()).toContain(mockData.location.name)
    expect(wrapper.text()).toContain(mockData.location.region)
    expect(wrapper.text()).toContain(mockData.current.wind_kph)
    expect(wrapper.text()).toContain(mockData.current.wind_degree)
  });

  it('displays formats the datetime to a locale format', async (): Promise<void> => {
    const anotherMockData = {
      location: {
        localtime: "2024-06-09T01:13:46.289Z",
      },
      current: {
        condition: {}
      }
    };

    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(anotherMockData),
      })) as any;

    const wrapper = mount(WeatherReport, {
      props: {
        coords: {
          latitude: 0,
          longitude: 0,
        },
      },
    });

    await flushPromises();

    const localTime = wrapper.find('[data-testid=localtime]');
    expect(localTime.text()).toBe('8 de junio de 2024, 8:13 p.\u00A0m.');
  });
});
